import { gameData } from './gameData.js';
import { saveGameResult } from './firebase.js';

class GameManager {
    constructor() {
        this.playerId = null;
        this.timerInterval = null;
        this.state = {
            currentSceneId: '',
            score: 0,
            inventory: [],
            elapsedTime: 0,
            isGameCleared: false,
            flags: new Proxy({}, {
                set: (target, prop, value) => {
                    target[prop] = value;
                    this.saveGame();
                    return true;
                }
            })
        };

        this.elements = {
            bg: document.getElementById('scene-bg'),
            video: document.getElementById('scene-video'),
            hitboxLayer: document.getElementById('hitbox-layer'),
            btnLeft: document.getElementById('btn-nav-left'),
            btnRight: document.getElementById('btn-nav-right'),
            btnBack: document.getElementById('btn-back'),
            scoreVal: document.getElementById('score-val'),
            dialogBox: document.getElementById('dialog-box'),
            dialogText: document.getElementById('dialog-text'),
            inventoryLayer: document.getElementById('inventory-layer'),
            inventoryGrid: document.getElementById('inventory-grid'),
            modalLayer: document.getElementById('modal-layer'),
            modalDesc: document.getElementById('modal-desc'),
            modalContent: document.getElementById('modal-content'),
            modalHint: document.getElementById('modal-hint'),
            btnModalHint: document.getElementById('btn-modal-hint'),
            btnModalSubmit: document.getElementById('btn-modal-submit'),
            btnModalClose: document.getElementById('btn-modal-close'),
            menuLayer: document.getElementById('menu-layer'),
            settingsPanel: document.getElementById('settings-panel'),
            soundToggle: document.getElementById('sound-toggle'),
            itemZoomLayer: document.getElementById('item-zoom-layer'),
            itemZoomImg: document.getElementById('item-zoom-img'),
            btnItemZoomClose: document.getElementById('btn-item-zoom-close')
        };

        this.dialogQueue = [];
        this.isDialogActive = false;
        this.currentDialogCallback = null;
        this.isSoundEnabled = localStorage.getItem('escape_room_sound_enabled') !== 'false';
        if (this.elements.soundToggle) {
            this.elements.soundToggle.checked = this.isSoundEnabled;
        }

        // Web Audio API setup
        this.audioCtx = null;
        this.audioBufferCache = {};
        this.audioUnlocked = false;
        this.audioUnlockPromise = null;
        this.htmlAudioPools = {};
        this.htmlAudioPoolSize = 3;
        this.htmlAudioPrimed = false;
        this._initAudioContext();

        this.initEventListeners();
    }

    _initAudioContext() {
        // Create and unlock audio inside the first user gesture. This is more
        // reliable on mobile Chrome/Safari than constructing AudioContext on load.
        ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'].forEach(evt => {
            document.addEventListener(evt, () => this.unlockAudio(), {
                capture: true,
                passive: true
            });
        });

        window.addEventListener('pageshow', () => {
            if (this.audioCtx) this.unlockAudio();
        }, { passive: true });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.audioCtx) this.unlockAudio();
        }, { passive: true });

        Object.values(this.soundSrcMap).forEach(src => this._prepareHtmlAudioPool(src));
    }

    _ensureAudioContext() {
        if (this.audioCtx) return this.audioCtx;
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) {
            console.warn('Web Audio API not supported');
            return null;
        }
        try {
            this.audioCtx = new AudioCtor();
            return this.audioCtx;
        } catch (e) {
            console.warn('Failed to create AudioContext:', e);
            return null;
        }
    }

    async _loadAudioBuffer(src) {
        if (this.audioBufferCache[src]) return this.audioBufferCache[src];
        if (!this._ensureAudioContext()) return null;
        try {
            const response = await fetch(src);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
            this.audioBufferCache[src] = audioBuffer;
            return audioBuffer;
        } catch (e) {
            console.warn('Failed to load audio:', src, e);
            return null;
        }
    }

    unlockAudio() {
        if (!this.isSoundEnabled) return Promise.resolve(false);
        if (!this._ensureAudioContext()) {
            this._primeHtmlAudio();
            return Promise.resolve(false);
        }
        if (this.audioUnlocked && this.audioCtx.state === 'running') {
            return Promise.resolve(true);
        }
        if (this.audioUnlockPromise) return this.audioUnlockPromise;

        this.audioUnlockPromise = Promise.resolve()
            .then(() => {
                if (this.audioCtx.state === 'suspended') {
                    return this.audioCtx.resume();
                }
            })
            .then(() => {
                const silentBuffer = this.audioCtx.createBuffer(1, 1, 22050);
                const source = this.audioCtx.createBufferSource();
                source.buffer = silentBuffer;
                source.connect(this.audioCtx.destination);
                source.start(0);

                document.querySelectorAll('audio').forEach(audio => {
                    audio.muted = false;
                    audio.volume = 1;
                    audio.load();
                });
                this._primeHtmlAudio();

                this.audioUnlocked = true;
                const globalSounds = ['sfx-click', 'sfx-error', 'sfx-inventory-get'];
                globalSounds.forEach(id => {
                    const el = document.getElementById(id);
                    if (el && el.src) this._loadAudioBuffer(el.src);
                });
                return true;
            })
            .catch((e) => {
                this.audioUnlockPromise = null;
                console.warn('Audio unlock failed:', e);
                return false;
            });

        return this.audioUnlockPromise;
    }

    _prepareHtmlAudioPool(src) {
        if (!src || this.htmlAudioPools[src]) return;
        this.htmlAudioPools[src] = Array.from({ length: this.htmlAudioPoolSize }, () => {
            const audio = new Audio(src);
            audio.preload = 'auto';
            audio.muted = false;
            audio.volume = 1;
            audio.load();
            return audio;
        });
    }

    _primeHtmlAudio() {
        if (this.htmlAudioPrimed) return;
        this.htmlAudioPrimed = true;
        Object.values(this.htmlAudioPools).flat().forEach(audio => {
            const restore = () => {
                audio.pause();
                try { audio.currentTime = 0; } catch (e) {}
                audio.muted = false;
                audio.volume = 1;
            };
            audio.muted = true;
            audio.volume = 0;
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.then(restore).catch(restore);
            } else {
                restore();
            }
        });
    }

    initEventListeners() {
        document.getElementById('btn-menu').addEventListener('click', () => {
            this.playSound('sfx-click');
            this.openMenu();
        });
        document.getElementById('btn-menu-resume').addEventListener('click', () => {
            this.playSound('sfx-click');
            this.closeMenu();
        });
        document.getElementById('btn-menu-home').addEventListener('click', () => {
            this.playSound('sfx-click');
            this.goToTitle();
        });
        document.getElementById('btn-menu-settings').addEventListener('click', () => {
            this.playSound('sfx-click');
            this.toggleSettings();
        });
        this.elements.soundToggle.addEventListener('change', () => {
            this.playSound('sfx-click');
            this.setSoundEnabled(this.elements.soundToggle.checked);
        });
        document.getElementById('btn-inventory').addEventListener('click', () => {
            this.playSound('sfx-click');
            this.openInventory();
        });
        document.getElementById('btn-inventory-close').addEventListener('click', () => {
            this.playSound('sfx-click');
            this.closeInventory();
        });
        this.elements.btnBack.addEventListener('click', () => {
            this.playSound('sfx-click');
            this.goBack();
        });
        this.elements.dialogBox.addEventListener('click', () => this.nextDialog());
        this.elements.btnItemZoomClose.addEventListener('click', () => {
            this.playSound('sfx-click');
            this.elements.itemZoomLayer.style.display = 'none';
        });

        this.elements.btnLeft.addEventListener('click', () => {
            this.playSound('sfx-click');
            this.navigateRoom(-1);
        });
        this.elements.btnRight.addEventListener('click', () => {
            this.playSound('sfx-click');
            this.navigateRoom(1);
        });
    }

    playSound(id, dynamicSrc = null) {
        if (!this.isSoundEnabled) return;
        // Determine the audio file URL
        let src = dynamicSrc;
        if (!src) {
            const el = document.getElementById(id);
            if (el) src = el.src;
        }
        if (!src) return;
        this._prepareHtmlAudioPool(src);
        const ready = this.unlockAudio();

        // Try Web Audio API first (works reliably on mobile)
        if (this.audioCtx) {
            const cached = this.audioBufferCache[src];
            if (cached) {
                ready.then(() => {
                    if (!this._playBuffer(cached)) this._playHtmlAudio(src);
                });
                return;
            }
            // Load and play asynchronously
            Promise.all([ready, this._loadAudioBuffer(src)]).then(([, buffer]) => {
                if (buffer) {
                    if (!this._playBuffer(buffer)) this._playHtmlAudio(src);
                } else {
                    this._playHtmlAudio(src);
                }
            });
            return;
        }

        // Fallback: HTMLAudioElement
        this._playHtmlAudio(src);
    }

    _playBuffer(buffer) {
        if (!this.audioCtx || !buffer) return false;
        try {
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume().catch(() => {});
            }
            const source = this.audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioCtx.destination);
            source.start(0);
            return true;
        } catch (e) {
            console.warn('Audio playback error:', e);
            return false;
        }
    }

    _playHtmlAudio(src) {
        this._prepareHtmlAudioPool(src);
        const pool = this.htmlAudioPools[src] || [];
        const audio = pool.find(item => item.paused || item.ended) || new Audio(src);
        try {
            audio.preload = 'auto';
            audio.muted = false;
            audio.volume = 1;
            try { audio.currentTime = 0; } catch (e) {}
            audio.play().catch((e) => {
                console.warn('HTML audio playback failed:', e);
            });
        } catch (e) {
            console.warn('HTML audio setup failed:', e);
        }
    }

    updateScore(points) {
        this.state.score += points;
        this.elements.scoreVal.innerText = this.state.score;
        this.saveGame();
    }

    openMenu() {
        this.playSound('sfx-click');
        this.elements.settingsPanel.style.display = 'none';
        this.elements.menuLayer.style.display = 'flex';
    }

    closeMenu() {
        this.playSound('sfx-click');
        this.elements.menuLayer.style.display = 'none';
    }

    toggleSettings() {
        this.playSound('sfx-click');
        const panel = this.elements.settingsPanel;
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    setSoundEnabled(isEnabled) {
        this.isSoundEnabled = isEnabled;
        localStorage.setItem('escape_room_sound_enabled', String(isEnabled));
        if (!isEnabled) {
            document.querySelectorAll('audio, video').forEach(media => {
                media.pause();
            });
        } else {
            this.unlockAudio();
            if (this.elements.video) {
                this.elements.video.muted = false;
                this.elements.video.volume = 1;
            }
            this.playSound('sfx-click');
        }
    }

    goToTitle() {
        this.saveGame();
        this.closeMenu();
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.elements.modalLayer.style.display = 'none';
        this.elements.inventoryLayer.style.display = 'none';
        this.elements.itemZoomLayer.style.display = 'none';
        this.elements.dialogBox.style.display = 'none';
        this.isDialogActive = false;
        this.dialogQueue = [];
        document.getElementById('title-screen').style.display = 'flex';
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.state.isGameCleared) {
                clearInterval(this.timerInterval);
                return;
            }
            this.state.elapsedTime++;
            this.updateTimeUI();
            
            // 50분(3000초) 초과 시 게임 오버
            if (this.state.elapsedTime >= 3000) {
                this.gameOver();
            }
        }, 1000);
    }

    updateTimeUI() {
        const timeDisplay = document.getElementById('time-val');
        if (!timeDisplay) return;
        
        const remaining = 3000 - this.state.elapsedTime;
        if (remaining <= 0) {
            timeDisplay.innerText = "00:00";
            timeDisplay.style.color = "#ff4444";
            return;
        }
        
        const m = Math.floor(remaining / 60).toString().padStart(2, '0');
        const s = (remaining % 60).toString().padStart(2, '0');
        timeDisplay.innerText = `${m}:${s}`;
        
        if (remaining < 300) {
            timeDisplay.style.color = "#ff4444";
            timeDisplay.style.textShadow = "0 0 5px rgba(255,0,0,0.5)";
        } else {
            timeDisplay.style.color = "#fff";
            timeDisplay.style.textShadow = "none";
        }
    }

    gameOver() {
        clearInterval(this.timerInterval);
        this.showDialog(["시간이 초과되었습니다... 눈앞이 깜깜해진다."], () => {
            this.goToTitle();
        });
    }

    async gameClear() {
        this.state.isGameCleared = true;
        clearInterval(this.timerInterval);
        this.saveGame();

        this.showDialog(["게임을 클리어했습니다! 데이터를 저장하는 중입니다..."]);
        
        const success = await saveGameResult(this.playerId, this.state.score, this.state.elapsedTime);
        
        let msg = `최종 점수: ${this.state.score}점\n걸린 시간: ${Math.floor(this.state.elapsedTime / 60)}분 ${this.state.elapsedTime % 60}초`;
        if (success) {
            msg += "\n\n기록이 성공적으로 저장되었습니다!";
        } else {
            msg += "\n\n기록 저장에 실패했습니다.";
        }
        
        this.openModal({
            desc: "축하합니다! 탈출에 성공했습니다.",
            html: `<div style="text-align:center; font-size:1.2em; margin-top:20px; white-space:pre-wrap;">${msg}</div>`,
            onSubmit: (el, gm) => {
                this.goToTitle();
                return true;
            }
        });
    }

    obtainItem(itemId) {
        if (!this.state.inventory.includes(itemId)) {
            this.state.inventory.push(itemId);
            this.playSound('sfx-inv-get');
            this.updateInventoryUI();
            this.saveGame();
            this.showDialog([`아이템을 획득했다.`]);
        }
    }

    updateInventoryUI() {
        this.elements.inventoryGrid.innerHTML = '';
        this.state.inventory.forEach(item => {
            const div = document.createElement('div');
            div.className = 'inv-item';
            const img = document.createElement('img');
            img.src = `scene/inventory/${item}.png`;
            div.appendChild(img);
            div.onclick = () => this.handleInventoryClick(item);
            this.elements.inventoryGrid.appendChild(div);
        });
    }

    openInventory() {
        this.playSound('sfx-click');
        this.elements.inventoryLayer.style.display = 'flex';
    }
    closeInventory() {
        this.playSound('sfx-click');
        this.elements.inventoryLayer.style.display = 'none';
    }

    handleInventoryClick(item) {
        this.closeInventory();
        const handler = gameData.inventoryHandlers[item];
        if (handler) {
            handler(this);
        } else {
            this.elements.itemZoomImg.src = `scene/inventory/${item}.png`;
            this.elements.itemZoomLayer.style.display = 'flex';
        }
    }

    showDialog(texts, callback = null) {
        if (texts.length === 0) return;
        this.dialogQueue = [...texts];
        this.currentDialogCallback = callback;
        this.isDialogActive = true;
        this.elements.dialogBox.style.display = 'flex';
        this.nextDialog();
    }

    nextDialog() {
        if (this.dialogQueue.length > 0) {
            this.playSound('sfx-click');
            this.elements.dialogText.innerText = this.dialogQueue.shift();
        } else {
            this.elements.dialogBox.style.display = 'none';
            this.isDialogActive = false;
            if (this.currentDialogCallback) {
                const cb = this.currentDialogCallback;
                this.currentDialogCallback = null;
                cb();
            }
        }
    }

    loadScene(sceneId) {
        const scene = gameData.scenes[sceneId];
        if (!scene) { console.error('Scene not found:', sceneId); return; }

        this.state.currentSceneId = sceneId;
        this.saveGame();
        
        this.elements.bg.src = scene.bg;
        
        const roomPattern = /^([a-e])_bg/;
        const match = sceneId.match(roomPattern);
        if (match && scene.showNav !== false) {
            this.elements.btnLeft.style.display = 'flex';
            this.elements.btnRight.style.display = 'flex';
        } else {
            this.elements.btnLeft.style.display = 'none';
            this.elements.btnRight.style.display = 'none';
        }

        if (scene.canGoBack) {
            this.elements.btnBack.style.display = 'block';
        } else {
            this.elements.btnBack.style.display = 'none';
        }

        this.elements.hitboxLayer.innerHTML = '';
        if (scene.hitboxes) {
            scene.hitboxes.forEach(hb => {
                if (hb.condition && !hb.condition(this.state)) return;
                
                const div = document.createElement('div');
                div.className = 'hitbox';
                div.style.left = hb.x + '%';
                div.style.top = hb.y + '%';
                div.style.width = hb.w + '%';
                div.style.height = hb.h + '%';
                div.onclick = () => {
                    if (this.isDialogActive) return;
                    this.playSound('sfx-click');
                    hb.onClick(this);
                };
                this.elements.hitboxLayer.appendChild(div);
            });
        }

        if (scene.onEnter) {
            scene.onEnter(this);
        }
    }

    goBack() {
        const scene = gameData.scenes[this.state.currentSceneId];
        if (scene && scene.backTarget) {
            let target = typeof scene.backTarget === 'function' ? scene.backTarget(this.state) : scene.backTarget;
            this.playSound('sfx-click');
            this.loadScene(target);
        }
    }

    navigateRoom(dir) {
        if (this.isDialogActive) return;
        const rooms = ['a', 'b', 'c', 'd'];
        const currentRoomMatch = this.state.currentSceneId.match(/^([a-d])_bg/);
        if (currentRoomMatch) {
            let idx = rooms.indexOf(currentRoomMatch[1]);
            idx = (idx + dir + rooms.length) % rooms.length;
            let nextRoom = rooms[idx];
            
            let bgState = this.state.flags.powerOn ? 'light' : 'dark';
            if (nextRoom === 'a' && !this.state.flags.powerOn) {
                this.playSound('sfx-click');
                this.loadScene('a_bg_1dark');
            } else {
                this.playSound('sfx-click');
                this.loadScene(`${nextRoom}_bg_${bgState}`);
            }
        }
    }

    openModal(config) {
        this.elements.modalDesc.innerText = config.desc;
        this.elements.modalContent.innerHTML = config.html || '';
        this.elements.modalLayer.style.display = 'flex';
        
        this.elements.btnModalHint.style.display = 'none';
        this.elements.modalHint.style.display = 'none';

        if (config.onHintInit) {
            config.onHintInit(this.elements.btnModalHint, this.elements.modalHint, this);
        } else if (config.hint || config.answer) {
            const showAnswer = () => {
                const answerPenalty = config.answerPenalty ?? (config.hint ? 5 : 10);
                if (!config.hint && !confirm(`이 문제는 바로 정답을 보여줍니다. ${answerPenalty}점이 감점됩니다. 계속할까요?`)) {
                    return;
                }
                this.updateScore(-answerPenalty);
                this.elements.modalHint.innerText = `정답: ${config.answer}`;
                this.elements.modalHint.style.display = 'block';
                this.elements.btnModalHint.style.display = 'none';
            };

            this.elements.btnModalHint.innerText = config.hint ? '힌트 보기 (-5점)' : `정답 보기 (-${config.answerPenalty ?? 10}점)`;
            this.elements.btnModalHint.style.display = 'inline-block';
            this.elements.btnModalHint.onclick = () => {
                if (config.hint) {
                    this.updateScore(-(config.hintPenalty ?? 5));
                    this.elements.modalHint.innerText = `힌트: ${config.hint}`;
                    this.elements.modalHint.style.display = 'block';

                    if (config.answer) {
                        this.elements.btnModalHint.innerText = `정답 보기 (-${config.answerPenalty ?? 5}점)`;
                        this.elements.btnModalHint.onclick = showAnswer;
                    } else {
                        this.elements.btnModalHint.style.display = 'none';
                    }
                } else {
                    showAnswer();
                }
            };
        }

        if (config.onInit) config.onInit(this.elements.modalContent, this);

        this.elements.btnModalSubmit.onclick = () => {
            const success = config.onSubmit(this.elements.modalContent, this);
            if (success) {
                this.playSound('sfx-click');
                this.closeModal();
            } else {
                this.playSound('sfx-error');
            }
        };

        this.elements.btnModalClose.onclick = () => {
            this.playSound('sfx-click');
            this.closeModal();
        };
    }

    closeModal() {
        this.elements.modalLayer.style.display = 'none';
        this.elements.modalContent.innerHTML = '';
    }

    playVideo(src, onComplete) {
        const video = this.elements.video;
        
        // Clean up any previous handlers
        video.onended = null;
        video.onerror = null;

        const finish = () => {
            video.style.display = 'none';
            video.onended = null;
            video.onerror = null;
            video.src = '';
            if (onComplete) onComplete();
        };

        this.unlockAudio();
        video.src = src;
        video.muted = !this.isSoundEnabled;
        video.volume = this.isSoundEnabled ? 1 : 0;
        video.playsInline = true;
        video.style.display = 'block';
        video.onended = finish;
        video.onerror = () => {
            console.warn('Video failed to load:', src);
            finish();
        };
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch((err) => {
                console.warn('Video play failed:', err);
                finish();
            });
        }
    }

    saveGame() {
        if (!this.playerId) return;
        const saveData = {
            currentSceneId: this.state.currentSceneId,
            inventory: this.state.inventory,
            score: this.state.score,
            elapsedTime: this.state.elapsedTime,
            isGameCleared: this.state.isGameCleared,
            flags: Object.assign({}, this.state.flags)
        };
        localStorage.setItem(`escape_room_save_${this.playerId}`, JSON.stringify(saveData));
    }

    loadGame(playerId) {
        const data = localStorage.getItem(`escape_room_save_${playerId}`);
        if (data) {
            const parsed = JSON.parse(data);
            this.state.currentSceneId = parsed.currentSceneId;
            this.state.inventory = parsed.inventory || [];
            this.state.score = parsed.score || 0;
            this.state.elapsedTime = parsed.elapsedTime || 0;
            this.state.isGameCleared = parsed.isGameCleared || false;
            
            Object.keys(this.state.flags).forEach(k => delete this.state.flags[k]);
            
            if (parsed.flags) {
                Object.keys(parsed.flags).forEach(k => {
                    this.state.flags[k] = parsed.flags[k];
                });
            }
            this.playerId = playerId;
            return true;
        }
        return false;
    }
}

window.onload = () => {
    const gm = new GameManager();
    
    const titleScreen = document.getElementById('title-screen');
    const input = document.getElementById('player-id-input');
    const errorText = document.getElementById('title-error');
    const btnNew = document.getElementById('btn-new-game');
    const btnContinue = document.getElementById('btn-continue-game');

    const validateInput = () => {
        const val = input.value.trim();
        if (!/^\d{8}$/.test(val)) {
            errorText.innerText = "반드시 8자리 숫자로 입력해주세요.";
            return null;
        }
        errorText.innerText = "";
        return val;
    };

    btnNew.onclick = () => {
        gm.playSound('sfx-click');
        const id = validateInput();
        if (!id) return;
        
        if (localStorage.getItem(`escape_room_save_${id}`)) {
            if (!confirm("이미 해당 번호로 저장된 데이터가 있습니다. 새로 시작하면 기존 데이터가 삭제됩니다. 계속하시겠습니까?")) {
                return;
            }
        }
        
        gm.playerId = id;
        gm.state.inventory = [];
        gm.state.score = 0;
        gm.state.elapsedTime = 0;
        gm.state.isGameCleared = false;
        Object.keys(gm.state.flags).forEach(k => delete gm.state.flags[k]);
        gm.updateScore(0);
        gm.updateInventoryUI();

        titleScreen.style.display = 'none';
        gm.updateTimeUI();
        gm.startTimer();
        gm.loadScene('a_bg_0curtain');
    };

    btnContinue.onclick = () => {
        gm.playSound('sfx-click');
        const id = validateInput();
        if (!id) return;

        if (gm.loadGame(id)) {
            titleScreen.style.display = 'none';
            gm.updateScore(0);
            gm.updateInventoryUI();
            
            if (!gm.state.isGameCleared) {
                gm.updateTimeUI();
                gm.startTimer();
            }

            if(gm.state.currentSceneId) {
                gm.loadScene(gm.state.currentSceneId);
            } else {
                gm.loadScene('a_bg_0curtain');
            }
        } else {
            errorText.innerText = "해당 번호로 저장된 데이터가 없습니다.";
        }
    };
};
