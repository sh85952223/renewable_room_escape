export const gameData = {
    scenes: {
        'a_bg_0curtain': {
            bg: 'scene/room_a/a_bg_0curtain.png',
            showNav: false,
            onEnter: (gm) => {
                if (!gm.state.flags.curtainOpened) {
                    gm.showDialog([
                        "여기가...아빠의 연구실...얼마나 자고 일어난걸까. 왜 여기 있는지도 모르겠다.",
                        "너무 깜깜하고 어둡다. 아무것도 보이지 않아. 어떻게 해야하지? 어디든 탐색해보자."
                    ]);
                }
            },
            hitboxes: [
                {
                    x: 70, y: 0, w: 30, h: 50,
                    onClick: (gm) => {
                        gm.playSound('sfx-dynamic', 'scene/room_a/a_bg_sfx_curtain_opening.mp3');
                        gm.state.flags.curtainOpened = true;
                        gm.loadScene('a_bg_1dark');
                    }
                }
            ]
        },
        'a_bg_1dark': {
            bg: 'scene/room_a/a_bg_1dark.png',
            showNav: true,
            onEnter: (gm) => {
                if (!gm.state.flags.switchChecked) {
                    gm.showDialog(["휴 이제야 좀 밝아졌네. 그래도 아직 어둡긴 하다."]);
                    gm.state.flags.switchChecked = true;
                }
            },
            hitboxes: [
                {
                    x: 58, y: 38, w: 8, h: 16,
                    onClick: (gm) => {
                        gm.loadScene('a_3a_switch_off');
                    }
                }
            ]
        },
        'a_3a_switch_off': {
            bg: 'scene/room_a/a_3a_switch_off.png',
            canGoBack: true,
            backTarget: (state) => state.flags.powerOn ? 'a_bg_2light' : 'a_bg_1dark',
            onEnter: (gm) => {
                if (!gm.state.flags.c_panel_fixed && !gm.state.flags.switchDialogShown) {
                    gm.showDialog(["스위치가 작동하지 않네...전기가 들어와야할 것 같은데. 일단 방의 다른 곳을 살펴보자."]);
                    gm.state.flags.switchDialogShown = true;
                }
            },
            hitboxes: [
                {
                    x: 30, y: 30, w: 40, h: 40,
                    onClick: (gm) => {
                        if (gm.state.flags.c_panel_fixed) {
                            gm.playSound('sfx-dynamic', 'scene/room_a/a_3b_sfx_switch_on.wav');
                            gm.state.flags.powerOn = true;
                            gm.loadScene('a_3b_switch_on');
                        } else {
                            gm.showDialog(["아직 전기가 들어오지 않는다."]);
                        }
                    }
                }
            ]
        },
        'a_3b_switch_on': {
            bg: 'scene/room_a/a_3b_swith_on.png',
            canGoBack: true,
            backTarget: 'a_bg_2light',
            onEnter: (gm) => {
                if (!gm.state.flags.a3b_dialog_shown) {
                    gm.showDialog(["이제 다른 곳을 더 둘러볼 수 있겠어. 환해졌다."]);
                    gm.state.flags.a3b_dialog_shown = true;
                }
            }
        },
        'b_bg_dark': {
            bg: 'scene/room_b/b_bg_dark.png',
            showNav: true,
            hitboxes: [
                {
                    x: 20, y: 40, w: 20, h: 20,
                    onClick: (gm) => {
                        gm.playSound('sfx-dynamic', 'scene/room_b/b_1_sfx_paper_paging.wav');
                        gm.state.flags.b1_checked = true;
                        gm.loadScene('b_1a_blue_note_inside');
                    }
                },
                {
                    x: 40, y: 70, w: 30, h: 20,
                    onClick: (gm) => {
                        if (!gm.state.flags.b1_checked) {
                            if (!gm.state.flags.b2_blocked_shown) {
                                gm.showDialog([
                                    "러그 아래 무언가 있다...",
                                    "하지만 아직 아무런 단서가 없어서 아무 것도 풀 수가 없어."
                                ]);
                                gm.state.flags.b2_blocked_shown = true;
                            } else {
                                gm.showDialog(["아직 아무런 단서가 없어서 풀 수가 없다."]);
                            }
                        } else {
                            if (!gm.state.flags.b2_rug_open) {
                                gm.playSound('sfx-dynamic', 'scene/room_b/b_2a_sfx_flap_rug.mp3');
                                gm.state.flags.b2_rug_open = true;
                            }
                            gm.loadScene('b_2_rug_open');
                        }
                    }
                }
            ]
        },
        'b_1a_blue_note_inside': {
            bg: 'scene/room_b/b_1a_blue_note_inside.png',
            canGoBack: true,
            backTarget: (state) => state.flags.powerOn ? 'b_bg_light' : 'b_bg_dark',
            onEnter: (gm) => {
                if (!gm.state.flags.b1_dialog_shown) {
                    gm.showDialog([
                        "확대해가면 읽어봐야겠어. 특히 빨간색 밑줄 친 부분에 써있는 말이 중요한 것 같은데....",
                        "우리가 석유에 많이 의존하는 인류라는 뜻이구나...호모오일리쿠스...기분이 이상하다."
                    ]);
                    gm.state.flags.b1_dialog_shown = true;
                }
            }
        },
        'b_2_rug_open': {
            bg: 'scene/room_b/b_2a_rug_open.png',
            canGoBack: true,
            backTarget: (state) => state.flags.powerOn ? 'b_bg_light' : 'b_bg_dark',
            onEnter: (gm) => {
                if (!gm.state.flags.b2_dialog_shown) {
                    gm.showDialog(["철문...? 여기에 아빠가 무엇인가 숨겨두신걸까?"]);
                    gm.state.flags.b2_dialog_shown = true;
                }
            },
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        if (!gm.state.flags.b2_unlocked) {
                            gm.loadScene('b_2b_panel_door_keypad');
                        } else {
                            gm.loadScene('b_2c_panel_door_unlock');
                        }
                    }
                }
            ]
        },
        'b_2b_panel_door_keypad': {
            bg: 'scene/room_b/b_2b_panel_door_keypad.png',
            canGoBack: true,
            backTarget: 'b_2_rug_open',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.openModal({
                            desc: "2자리 숫자를 입력하시오. 파란 노트에서 확인한 '호모[오일]리쿠스'와 관련이 있습니다.",
                            hint: "오일이라는 글자를 한글자 한글자 숫자로 생각해보시오. 오=? 일=?",
                            answer: "51",
                            html: `
                                <div id="keypad-display"></div>
                                <div class="keypad-grid">
                                    <button class="keypad-btn">1</button><button class="keypad-btn">2</button><button class="keypad-btn">3</button>
                                    <button class="keypad-btn">4</button><button class="keypad-btn">5</button><button class="keypad-btn">6</button>
                                    <button class="keypad-btn">7</button><button class="keypad-btn">8</button><button class="keypad-btn">9</button>
                                    <button class="keypad-btn">C</button><button class="keypad-btn">0</button><button class="keypad-btn">OK</button>
                                </div>
                            `,
                            onInit: (el, gm) => {
                                let val = "";
                                const display = el.querySelector('#keypad-display');
                                el.querySelectorAll('.keypad-btn').forEach(btn => {
                                    btn.onclick = () => {
                                        gm.playSound('sfx-dynamic', 'scene/room_b/b_2b_sfx_panel_door_keypad_click.wav');
                                        if (btn.innerText === 'C') val = "";
                                        else if (btn.innerText === 'OK') document.getElementById('btn-modal-submit').click();
                                        else if (val.length < 2) val += btn.innerText;
                                        display.innerText = val;
                                        el.dataset.val = val;
                                    };
                                });
                            },
                            onSubmit: (el, gm) => {
                                if (el.dataset.val === '51') {
                                    gm.updateScore(10);
                                    gm.state.flags.b2_unlocked = true;
                                    gm.showDialog(["정답을 맞췄어! 오일을 강조하고 싶으셨던거야...안에는 뭐가 들어있을까."], () => {
                                        gm.loadScene('b_2c_panel_door_unlock');
                                    });
                                    return true;
                                } else {
                                    gm.playSound('sfx-dynamic', 'scene/room_b/b_2b_sfx_panel_door_keypad_negative.wav');
                                    return false;
                                }
                            }
                        });
                    }
                }
            ]
        },
        'b_2c_panel_door_unlock': {
            bg: 'scene/room_b/b_2c_panel_door_unlock.png',
            canGoBack: true,
            backTarget: 'b_2_rug_open',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        if (gm.state.flags.sun_panel_obtained) {
                            gm.showDialog(["이건 더이상 살펴볼 필요가 없을 것 같아."]);
                            return;
                        }
                        gm.openModal({
                            desc: "이것의 이름을 입력하시오.",
                            hint: "ㅌㅇㅈㅈ",
                            answer: "태양전지",
                            html: `<input type="text" id="panel-name-input" class="text-input" placeholder="이름을 입력하세요">`,
                            onSubmit: (el, gm) => {
                                const val = el.querySelector('#panel-name-input').value.replace(/\s+/g, '');
                                if (['태양전지', '태양광패널', '태양광패널비슷한것들'].some(ans => val.includes(ans))) {
                                    gm.updateScore(10);
                                    gm.state.flags.sun_panel_obtained = true;
                                    gm.obtainItem('item_01_solar_panel');
                                    return true;
                                }
                                return false;
                            }
                        });
                    }
                }
            ]
        },
        'c_bg_dark': {
            bg: 'scene/room_c/c_bg_dark.png',
            showNav: true,
            hitboxes: [
                {
                    x: 70, y: 10, w: 20, h: 80,
                    onClick: (gm) => {
                        gm.playSound('sfx-dynamic', 'scene/room_c/c_3a_sfx_ladder_zoom.mp3');
                        gm.loadScene('c_4a_climbing');
                    }
                }
            ]
        },
        'c_4a_climbing': {
            bg: 'scene/room_c/c_4a_climbing.png',
            canGoBack: true,
            backTarget: 'c_bg_dark',
            hitboxes: [
                {
                    x: 30, y: 10, w: 40, h: 60,
                    onClick: (gm) => {
                        gm.playSound('sfx-dynamic', 'scene/room_c/c_4a_sfx_door_clicked.wav');
                        gm.loadScene('c_4b_door_open');
                    }
                }
            ]
        },
        'c_4b_door_open': {
            bg: 'scene/room_c/c_4b_door_open.png',
            canGoBack: true,
            backTarget: 'c_4a_climbing',
            hitboxes: [
                {
                    x: 20, y: 20, w: 60, h: 50,
                    onClick: (gm) => {
                        if (gm.state.flags.c_panel_fixed) {
                            gm.showDialog(["이건 더이상 살펴볼 필요가 없을 것 같아."]);
                            return;
                        }
                        gm.playSound('sfx-dynamic', 'scene/room_c/c_4c_sfx_panel_steel.mp3');
                        gm.showDialog(["인벤토리에서 아이템을 선택하자.", "이 뼈대에 맞는 무언가가 필요해."]);
                    }
                }
            ]
        },
        'c_bg_light': {
            bg: 'scene/room_c/c_bg_light.png',
            showNav: true,
            hitboxes: [
                {
                    x: 10, y: 20, w: 30, h: 60, // 냉장고
                    onClick: (gm) => {
                        gm.loadScene('c_1_refrigerator');
                    }
                },
                {
                    x: 50, y: 40, w: 40, h: 30, // 싱크대
                    onClick: (gm) => {
                        gm.loadScene('c_2_sink');
                    }
                }
            ]
        },
        'c_1_refrigerator': {
            bg: 'scene/room_c/c_1_refrigerator.png',
            canGoBack: true,
            backTarget: 'c_bg_light',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.state.flags.fridge_checked = true;
                        gm.playSound('sfx-dynamic', 'scene/room_c/c_1_sfx_refrigerator_door_clicked.mp3');
                        // 비디오 재생 후 냉동실 화면 전환
                        gm.playVideo('scene/room_c/c_1a_video_refrigerator_opened.mp4', () => {
                            gm.loadScene('c_1b_freezer_open');
                        });
                    }
                }
            ]
        },
        'c_1b_freezer_open': {
            bg: 'scene/room_c/c_1b_freezer_open.png',
            canGoBack: true,
            backTarget: 'c_bg_light',
            onEnter: (gm) => {
                if (gm.state.flags.car_key_obtained) return;
                
                if (!gm.state.flags.sink_checked) {
                    gm.showDialog([
                        "차키 같기는 한데.....뜨거운 물로 녹이지 않는 이상 꺼내기 어렵겠어.",
                        "싱크대에서 뜨거운 물을 구할 수 있겠지?"
                    ]);
                } else if (!gm.state.flags.hot_water_obtained) {
                    gm.showDialog([
                        "먼저 뜨거운 물부터 받아야할 것 같아. 다시 싱크대로 가보자."
                    ]);
                } else {
                    gm.showDialog([
                        "인벤토리의 뜨거운 물을 사용해서 녹여보자."
                    ]);
                }
            }
        },
        'c_2_sink': {
            bg: 'scene/room_c/c_2_sink.png',
            canGoBack: true,
            backTarget: 'c_bg_light',
            onEnter: (gm) => {
                if (gm.state.flags.water_cup_obtained) {
                    if (gm.state.flags.sunheat_ready && !gm.state.flags.hot_water_obtained) {
                        gm.showDialog(["이제 뜨거운 물이 나온다!"], () => {
                            gm.playSound('sfx-dynamic', 'scene/room_c/c_2a_sfx_hot_water_on.wav');
                            gm.state.flags.hot_water_obtained = true;
                            // Change item_05_water_cup to item_08_hot_water_cup
                            const idx = gm.state.inventory.indexOf('item_05_water_cup');
                            if (idx !== -1) {
                                gm.state.inventory.splice(idx, 1);
                                gm.obtainItem('item_08_hot_water_cup');
                            }
                        });
                    } else if (!gm.state.flags.hot_water_obtained) {
                        if (gm.state.flags.fridge_checked) {
                            gm.showDialog([
                                "아직 물이 나오지 않는다.",
                                "온수가 나오려면 온수 시스템이 활성화 되어야하는데..",
                                "아직 방에서 할 수 있는 건 없어보여. 다른 곳부터 둘러보자."
                            ]);
                        } else {
                            gm.showDialog([
                                "아직 물이 나오지 않는다.",
                                "또 다른 곳도 둘러보자."
                            ]);
                        }
                    }
                    return;
                }

                gm.state.flags.sink_checked = true;
                gm.showDialog(["유리컵을 하나 발견했다!"], () => {
                    gm.obtainItem('item_05_water_cup');
                    gm.state.flags.water_cup_obtained = true;

                    if (gm.state.flags.fridge_checked) {
                        gm.showDialog([
                            "아직 물이 나오지 않는다.",
                            "온수가 나오려면 온수 시스템이 활성화 되어야하는데..",
                            "아직 방에서 할 수 있는 건 없어보여. 다른 곳부터 둘러보자."
                        ]);
                    } else {
                        gm.showDialog([
                            "아직 물이 나오지 않는다.",
                            "또 다른 곳도 둘러보자."
                        ]);
                    }
                });
            }
        },
        'd_bg_dark': {
            bg: 'scene/room_d/d_bg_dark.png',
            showNav: true,
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.showDialog(["아무 것도 둘러볼 수 없다..."]);
                    }
                }
            ]
        },
        'd_bg_light': {
            bg: 'scene/room_d/d_bg_light.png',
            showNav: true,
            hitboxes: [
                {
                    x: 0, y: 15, w: 45, h: 60, // d1 배전함 (크게 늘림)
                    onClick: (gm) => {
                        gm.loadScene('d_1a_panel_dusty');
                    }
                },
                {
                    x: 60, y: 40, w: 30, h: 30, // d2 소파
                    onClick: (gm) => {
                        gm.loadScene('d_2_sofa');
                    }
                },
                {
                    x: 82, y: 58, w: 10, h: 18, // d3 면도날
                    onClick: (gm) => {
                        if (gm.state.flags.razor_obtained) {
                            gm.showDialog(["더 이상 살필 것이 없는 것 같다."]);
                            return;
                        }
                        gm.state.flags.razor_obtained = true;
                        gm.obtainItem('item_06_razor');
                    }
                }
            ]
        },
        'd_2_sofa': {
            bg: 'scene/room_d/d_2a_sofa_zoom.png',
            canGoBack: true,
            backTarget: 'd_bg_light',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        if (!gm.state.flags.memo_found) {
                            // 원래는 면도칼(item_06_razor) 필요, 임시로 무조건 획득 가능하게 하거나 소지 검사.
                            // PRD대로면 면도칼이 필요함.
                            if (gm.state.inventory.includes('item_06_razor')) {
                                gm.playSound('sfx-dynamic', 'scene/room_d/d_2b_sfx_sofa_tearing.mp3');
                                gm.state.flags.memo_found = true;
                                
                                let diag = ["메모를 발견했다!"];
                                if (gm.state.flags.b3b_checked) {
                                    diag.push("어디선가 본 모양이랑 비슷해. 아마 책상 옆의 선반 상자에서 본 거랑 비슷한 것 같아.", "순서를 표시한 것 같기도 하고....");
                                } else {
                                    diag.push("방을 둘러보면서 이걸 활용할 수 있는 곳을 찾아봐야겠어. 안 본 곳이 어디있을까...책상 옆 선반 쪽에 무언가 더 있었나?");
                                }
                                gm.loadScene('d_2c_memo_found');
                                gm.showDialog(diag);
                            } else {
                                gm.showDialog([
                                    "여기에서 뭔가 얻기 위해서는 무언가 필요한 것 같아.",
                                    "여길 열만한 도구가 필요해."
                                ]);
                            }
                        } else {
                            gm.showDialog(["찢어진 소파다. 더 이상 살펴볼 건 없다."]);
                        }
                    }
                }
            ]
        },
        'd_1a_panel_dusty': {
            bg: 'scene/room_d/d_1a_panel_dusty.png',
            canGoBack: true,
            backTarget: 'd_bg_light',
            onEnter: (gm) => {
                gm.showDialog(["먼지가 너무 심해....뭔가로 닦아야할 것만 같아."]);
            }
        },
        'd_1c_panel_cleaned': {
            bg: 'scene/room_d/d_1c_panel_cleaned.png',
            canGoBack: true,
            backTarget: 'd_bg_light',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.playSound('sfx-dynamic', 'scene/room_d/d_1c_panel_cleaned_and_clicked.wav');
                        gm.loadScene('d_1d_windmap_problem');
                    }
                }
            ]
        },
        'd_1d_windmap_problem': {
            bg: 'scene/room_d/d_1d_windmap_problem.png',
            canGoBack: true,
            backTarget: 'd_1c_panel_cleaned',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.state.flags.radio_broadcast_on = true;
                        gm.loadScene('d_1e_windmap_solved');
                    }
                }
            ]
        },
        'd_1e_windmap_solved': {
            bg: 'scene/room_d/d_1e_windmap_solved.png',
            canGoBack: true,
            backTarget: 'd_1c_panel_cleaned',
            onEnter: (gm) => {
                if (gm.state.flags.d1_broadcast_played) return;
                gm.state.flags.d1_broadcast_played = true;
                gm.playVideo('scene/room_d/d_1f_video_broadcast_on.mp4', () => {
                    gm.loadScene('d_1g_radio_noise');
                });
            }
        },
        'd_1g_radio_noise': {
            bg: 'scene/room_d/d_1g_radio_noise.png',
            canGoBack: true,
            backTarget: 'd_bg_light',
            onEnter: (gm) => {
                if (!gm.state.flags.d1_radio_noise_played) {
                    gm.playSound('sfx-dynamic', 'scene/room_d/d_1g_sfx_radio_noise.wav');
                    gm.state.flags.d1_radio_noise_played = true;
                    gm.showDialog(["?? ??? ???... ??? ????? ??? ???? ? ??."]);
                }
            }
        },
        'd_2c_memo_found': {
            bg: 'scene/room_d/d_2c_memo_found.png',
            canGoBack: true,
            backTarget: 'd_bg_light',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.playSound('sfx-dynamic', 'scene/room_d/d_2d_sfx_memo_opened.wav');
                        gm.loadScene('d_2d_memo_opened');
                    }
                }
            ]
        },
        'd_2d_memo_opened': {
            bg: 'scene/room_d/d_2d_memo_opened.png',
            canGoBack: true,
            backTarget: 'd_bg_light'
        },
        'a_bg_2light': {
            bg: 'scene/room_a/a_bg_2light.png',
            showNav: true,
            hitboxes: [
                {
                    x: 30, y: 40, w: 20, h: 20, // a1 라디오
                    onClick: (gm) => {
                        if (!gm.state.flags.radio_broadcast_on) {
                            gm.showDialog(["전원이 들어오지 않아 작동하지 않는다... 배전함 쪽에 문제가 있는 것 같다."]);
                        } else {
                            gm.loadScene('a_1a_radio');
                        }
                    }
                },
                {
                    x: 60, y: 30, w: 20, h: 50, // a2 도어락
                    onClick: (gm) => {
                        if (gm.state.inventory.includes('item_07_card_key')) {
                            gm.playSound('sfx-dynamic', 'scene/room_a/a_2b_sfx_door_open.mp3');
                            gm.loadScene('e_bg');
                        } else {
                            gm.playSound('sfx-dynamic', 'scene/room_a/a_2a_sfx_door_rattle.mp3');
                            gm.loadScene('a_2a_doorlock');
                        }
                    }
                }
            ]
        },
        'a_1a_radio': {
            bg: 'scene/room_a/a_1a_radio.png',
            canGoBack: true,
            backTarget: 'a_bg_2light',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        if (gm.state.flags.radio_solved) return;
                        
                        gm.openModal({
                            desc: "주파수를 맞추시오.",
                            html: `<input type="number" id="radio-freq" class="text-input" placeholder="00.0">`,
                            hint: "라디오는 주파수처럼 보이는 숫자 단서를 요구한다. 소수점 한 자리까지 입력해보자.",
                            answer: "91.6",
                            onInit: (el, gm) => {
                                const input = el.querySelector('#radio-freq');
                                if (input) {
                                    input.addEventListener('input', () => {
                                        gm.playSound('sfx-dynamic', 'scene/room_a/a_1a_sfx_radio_turning.mp3');
                                    });
                                }
                            },
                            onSubmit: (el, gm) => {
                                const val = el.querySelector('#radio-freq').value;
                                if (val === '91.6' || val === '916') {
                                    gm.state.flags.radio_solved = true;
                                    gm.playSound('sfx-dynamic', 'scene/room_a/a_1b_sfx_falling_photo_piece.wav');
                                    gm.obtainItem('item_06_photo_piece');
                                    
                                    let diag = ["라디오 주파수를 맞췄더니 사진 조각이 떨어졌어."];
                                    if (gm.state.inventory.includes('item_04_album')) {
                                        diag.push("아까 앨범이 있지 않았나? 인벤토리에서 살펴보자.");
                                    } else {
                                        diag.push("이 사진 조각을 활용할 수 있는 무언가 있을거야. 방을 둘러보며 찾아보자.");
                                    }
                                    gm.showDialog(diag);
                                    return true;
                                } else {
                                    gm.playSound('sfx-error');
                                    return false;
                                }
                            }
                        });
                    }
                }
            ]
        },
        'a_2a_doorlock': {
            bg: 'scene/room_a/a_2a_doorlock.png',
            canGoBack: true,
            backTarget: 'a_bg_2light',
            onEnter: (gm) => {
                gm.showDialog(["카드키로 나가는 문 같다....하지만 아직 나갈 수 없어. 카드키를 찾아야해."]);
            }
        },
        'b_bg_light': {
            bg: 'scene/room_b/b_bg_light.png',
            showNav: true,
            hitboxes: [
                {
                    x: 38, y: 10, w: 22, h: 22, // b0 손수건
                    onClick: (gm) => {
                        if (gm.state.flags.b0_hangerchief_obtained) {
                            gm.showDialog(["이건 더이상 살펴볼 필요가 없을 것 같아."]);
                            return;
                        }
                        gm.state.flags.b0_hangerchief_obtained = true;
                        gm.obtainItem('item_02_hangerchief');
                    }
                },
                {
                    x: 73, y: 18, w: 10, h: 14, // b3a 유리병
                    onClick: (gm) => {
                        if (gm.state.flags.b3a_glass_bottle_obtained) {
                            gm.showDialog(["이건 더이상 살펴볼 필요가 없을 것 같아."]);
                            return;
                        }
                        gm.state.flags.b3a_glass_bottle_obtained = true;
                        gm.obtainItem('item_03_glass_bottle');
                    }
                },
                {
                    x: 68, y: 34, w: 18, h: 16, // b3b 상자 줌
                    onClick: (gm) => {
                        gm.loadScene('b_3b_s1_box_upperside');
                    }
                },
                {
                    x: 73, y: 55, w: 15, h: 16, // b3c 앨범
                    onClick: (gm) => {
                        if (gm.state.flags.b3c_album_obtained) {
                            gm.showDialog(["이건 더이상 살펴볼 필요가 없을 것 같아."]);
                            return;
                        }
                        gm.state.flags.b3c_album_obtained = true;
                        gm.obtainItem('item_04_album');
                    }
                }
            ]
        },
        'b_3b_s1_box_upperside': {
            bg: 'scene/room_b/b_3b_s1_box_upperside.png',
            canGoBack: true,
            backTarget: 'b_bg_light',
            onEnter: (gm) => {
                gm.state.flags.b3b_checked = true;
                if (!gm.state.flags.memo_found) {
                    gm.showDialog(["이건 아무런 힌트가 없어서 아직 풀 수가 없어. 모양만 잘 봐두자."]);
                } else {
                    gm.showDialog([
                        "그래 아까 봤던 소파 쪽지랑 분명 관련이 있어. 순서대로 정답을 입력해야할거야.",
                        "버튼들을 순서대로 터치해보자."
                    ]);
                }
            },
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        if (!gm.state.flags.memo_found) {
                            gm.showDialog(["아직 힌트가 부족해서 함부로 누를 수 없다."]);
                            return;
                        }
                        
                        const isHelperMode = gm.state.flags.b3b_fails >= 3;
                        
                        gm.openModal({
                            desc: isHelperMode ? "너무 많이 틀렸습니다. 1번부터 순서대로 맞는 에너지를 입력하세요." : "순서대로 올바른 에너지를 입력하세요.",
                            answer: "1 연료 전지, 2 지열, 3 폐기물, 4 해양, 5 바이오, 6 수력, 7 수소, 8 태양광, 9 풍력, 10 석탄 가스화 액화, 11 태양열",
                            answerPenalty: 10,
                            html: `
                                <div class="dropdown-group" id="b3b-dropdowns">
                                    <!-- 드롭다운 11개 동적 생성 -->
                                </div>
                            `,
                            onInit: (el, gm) => {
                                const group = el.querySelector('#b3b-dropdowns');
                                const options = [
                                    {val: "태양광", hint: "ㅌㅇㄱ"}, {val: "태양열", hint: "ㅌㅇㅇ"}, 
                                    {val: "연료 전지", hint: "ㅇㄹ ㅈㅈ"}, {val: "바이오", hint: "ㅂㅇㅇ"}, 
                                    {val: "풍력", hint: "ㅍㄹ"}, {val: "석탄 가스화 액화", hint: "ㅅㅌ ㄱㅅㅎ ㅇㅎ"}, 
                                    {val: "수력", hint: "ㅅㄹ"}, {val: "수소", hint: "ㅅㅅ"}, 
                                    {val: "해양", hint: "ㅎㅇ"}, {val: "폐기물", hint: "ㅍㄱㅁ"}, {val: "지열", hint: "ㅈㅇ"}
                                ];
                                const correct = ["연료 전지", "지열", "폐기물", "해양", "바이오", "수력", "수소", "태양광", "풍력", "석탄 가스화 액화", "태양열"];
                                
                                let html = "";
                                for(let i=1; i<=11; i++) {
                                    let helperText = isHelperMode ? ` (${correct[i-1].split(' ').map(w=>w.charAt(0)).join('')}...)` : '';
                                    html += `<select id="ans_${i}"><option value="">${i}번 선택${helperText}</option>`;
                                    options.forEach(opt => html += `<option value="${opt.val}">${opt.val}</option>`);
                                    html += `</select>`;
                                }
                                group.innerHTML = html;
                                group.querySelectorAll('select').forEach(select => {
                                    select.addEventListener('change', () => {
                                        gm.playSound('sfx-dynamic', 'scene/room_b/b_3b_s1_sfx_box_upperside_button_click.wav');
                                    });
                                });
                            },
                            onSubmit: (el, gm) => {
                                const correct = ["연료 전지", "지열", "폐기물", "해양", "바이오", "수력", "수소", "태양광", "풍력", "석탄 가스화 액화", "태양열"];
                                let isCorrect = true;
                                for(let i=1; i<=11; i++) {
                                    if(el.querySelector(`#ans_${i}`).value !== correct[i-1]) isCorrect = false;
                                }
                                if(isCorrect) {
                                    gm.updateScore(10);
                                    gm.state.flags.b3b_solved = true;
                                    gm.playSound('sfx-dynamic', 'scene/room_b/b_3b_s3_sfx_box_opened.wav');
                                    gm.showDialog(["상자가 열렸다! 네비게이션 목적지 힌트인 것 같아."]); 
                                    gm.loadScene('b_bg_light'); 
                                    return true;
                                } else {
                                    gm.playSound('sfx-dynamic', 'scene/room_b/b_3b_s2_box_click_checked_negative.wav');
                                    gm.state.flags.b3b_fails = (gm.state.flags.b3b_fails || 0) + 1;
                                    if (gm.state.flags.b3b_fails === 3) {
                                        setTimeout(() => {
                                            gm.showDialog(["터치가 잘 안되거나 너무 많이 틀리는 것 같다. 도우미 모드가 활성화되었다.", "다시 클릭해서 시도해보자."]);
                                        }, 500);
                                    }
                                    return false;
                                }
                            }
                        });
                    }
                }
            ]
        },
        'e_bg': {
            bg: 'scene/yard_e/e_bg.png',
            showNav: true,
            hitboxes: [
                {
                    x: 10, y: 18, w: 18, h: 35,
                    onClick: (gm) => {
                        gm.loadScene('e_1a_sunheat_zoom');
                    }
                },
                {
                    x: 30, y: 38, w: 22, h: 36,
                    onClick: (gm) => {
                        gm.playSound('sfx-dynamic', 'scene/yard_e/e_2_sfx_poop_zoom.wav');
                        gm.loadScene('e_2a_poop_zoom');
                    }
                },
                {
                    x: 56, y: 20, w: 22, h: 42,
                    onClick: (gm) => {
                        gm.loadScene('e_3a_poop_machine');
                    }
                },
                {
                    x: 30, y: 60, w: 40, h: 30, // e4 버스
                    onClick: (gm) => {
                        if (!gm.state.flags.e3_charged) {
                            gm.showDialog(["아직 버스 말고 다른 곳부터 살펴보자."]);
                        } else {
                            gm.loadScene('e_4a_bus_zoom');
                        }
                    }
                }
            ]
        },
        'e_1a_sunheat_zoom': {
            bg: 'scene/yard_e/e_1a_sunheat_zoom.png',
            canGoBack: true,
            backTarget: 'e_bg',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.playSound('sfx-dynamic', 'scene/yard_e/e_1b_sfx_sunheat_lever_down.mp3');
                        gm.state.flags.sunheat_ready = true;
                        gm.loadScene('e_1b_sunheat_lever_down');
                    }
                }
            ]
        },
        'e_1b_sunheat_lever_down': {
            bg: 'scene/yard_e/e_1b_sunheat_lever_down.png',
            canGoBack: true,
            backTarget: 'e_bg',
            onEnter: (gm) => {
                gm.showDialog(["이제 따뜻한 물을 쓸 수 있겠어. 아까 싱크대에서 물을 담아야해."]);
            }
        },
        'e_2a_poop_zoom': {
            bg: 'scene/yard_e/e_2a_poop_zoom.png',
            canGoBack: true,
            backTarget: 'e_bg',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.showDialog(["이걸 담을 병이 없어....아마 책상 근처 선반에서 어떤 병을 본 것 같은데..."]);
                    }
                }
            ]
        },
        'e_2b_glass_bottle_input': {
            bg: 'scene/yard_e/e_2b_glass_bottle_input.png',
            canGoBack: true,
            backTarget: 'e_2a_poop_zoom'
        },
        'e_3a_poop_machine': {
            bg: 'scene/yard_e/e_3a_poop_machine.png',
            canGoBack: true,
            backTarget: 'e_bg',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.showDialog(["연료가 없어...일단 다른 곳에서 연료를 획득하는게 먼저인 것 같아."]);
                    }
                }
            ]
        },
        'e_3c_machine_active': {
            bg: 'scene/yard_e/e_3c_machine_active.png',
            canGoBack: true,
            backTarget: 'e_bg',
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.playSound('sfx-dynamic', 'scene/yard_e/e_3b2_sfx_processing.wav');
                        gm.showDialog(["연료가 충전된다."], () => {
                            gm.playSound('sfx-dynamic', 'scene/yard_e/e_3c_sfx_charging.mp3');
                            gm.state.flags.e3_charged = true;
                            gm.loadScene('e_3c_charging');
                        });
                    }
                }
            ]
        },
        'e_3c_charging': {
            bg: 'scene/yard_e/e_3c_charging.png',
            canGoBack: true,
            backTarget: 'e_bg'
        },
        'e_4a_bus_zoom': {
            bg: 'scene/yard_e/e_4a_bus_zoom.png',
            canGoBack: true,
            backTarget: 'e_bg',
            onEnter: (gm) => {
                if (!gm.state.flags.bus_entered_once) {
                    gm.showDialog(["오래된 친환경 버스 느낌이 난다....아빠가 연구하시던 걸까."]);
                    gm.state.flags.bus_entered_once = true;
                }
            },
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.loadScene('e_4b_bus_inside');
                    }
                }
            ]
        },
        'e_4b_bus_inside': {
            bg: 'scene/yard_e/e_4b_bus_inside.png',
            canGoBack: true,
            backTarget: 'e_4a_bus_zoom',
            onEnter: (gm) => {
                // 이미 시동이 걸려있는 상태면 바로 차징된 화면(e_4d)으로 전환되도록 유도
                if (gm.state.flags.bus_started) {
                    gm.loadScene('e_4d_bus_charged');
                }
            },
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        gm.showDialog(["인벤토리에서 차키를 사용해야 할 것 같다."]);
                    }
                }
            ]
        },
        'e_4d_bus_charged': {
            bg: 'scene/yard_e/e_4d_bus_charged.png',
            canGoBack: true,
            backTarget: 'e_4a_bus_zoom',
            onEnter: (gm) => {
                if (!gm.state.flags.bus_nav_dialog_shown) {
                    gm.showDialog(["이제 네비게이션 주소를 입력해야해. 어디로 가야하는걸까."]);
                    gm.state.flags.bus_nav_dialog_shown = true;
                }
            },
            hitboxes: [
                {
                    x: 0, y: 0, w: 100, h: 100,
                    onClick: (gm) => {
                        if (!gm.state.flags.b3b_solved) {
                            gm.showDialog([
                                "하지만 이 힌트를 아직 얻지 못했어.",
                                "난 지금 어디로 가야할지 모르는 상황이야. 책상 근처 선반의 두번째 칸 상자를 풀면 힌트가 있을 것 같아..."
                            ]);
                            return;
                        }

                        // b3b_solved 시 네비게이션 목적지 모달 팝업
                        gm.openModal({
                            desc: "가고자 하는 목적지의 주소를 입력하세요. (형식: 00도 00시 ____________ )",
                            hint: "책상 근처 선반의 두번째 칸 상자에서 얻은 네비게이션 목적지 단서를 떠올려보자.",
                            answer: "미래도 희망시 신재생 에너지 연구소",
                            html: `<input type="text" id="nav-address" class="text-input" placeholder="주소를 입력하세요">`,
                            onSubmit: (el, gm) => {
                                const val = el.querySelector('#nav-address').value.replace(/\s+/g, '');
                                if (val.includes('미래도희망시신재생에너지연구소')) {
                                    gm.showDialog([
                                        "출발한다!",
                                        "아빠가 내게 원하신게 이거였어.",
                                        "신재생 에너지 연구를 통해 미래의 희망을 찾으라고 하신거야."
                                    ], () => {
                                        gm.gameClear();
                                    });
                                    return true;
                                } else {
                                    gm.playSound('sfx-error');
                                    return false;
                                }
                            }
                        });
                    }
                }
            ]
        }
    },
    inventoryHandlers: {
        'item_01_solar_panel': (gm) => {
            if (gm.state.currentSceneId === 'c_4b_door_open' && !gm.state.flags.c_panel_fixed) {
                gm.openModal({
                    desc: "이 중 태양광 발전이 잘 되는 조건 3개를 고르시오.",
                    html: `
                        <div class="checkbox-group">
                            <label class="checkbox-item"><input type="checkbox" value="1"> 가. 태양광 패널 위에 먼지나 쌓인 눈을 자주 닦아주어야 빛이 잘 흡수되어 발전량이 늘어난다.</label>
                            <label class="checkbox-item"><input type="checkbox" value="2"> 나. 주변에 높은 건물이나 나무가 없어서 패널에 그림자가 지지 않아야 전기를 끊기지 않고 만들 수 있다.</label>
                            <label class="checkbox-item"><input type="checkbox" value="3"> 다. 태양광 발전은 구름이 잔뜩 낀 흐린 날에 빛이 산란되기 때문에 맑은 날보다 전기가 더 많이 생산된다.</label>
                            <label class="checkbox-item"><input type="checkbox" value="4"> 라. 하루 중 햇빛이 비치는 시간인 일조 시간이 길수록 태양 에너지를 받을 수 있는 총량이 많아진다.</label>
                            <label class="checkbox-item"><input type="checkbox" value="5"> 마. 태양광 패널은 빛이 아닌 열에너지를 이용하기 때문에, 패널 표면이 아주 뜨거울수록 전기가 더 잘 만들어진다.</label>
                        </div>
                    `,
                    onHintInit: (hintBtn, hintDisplay, modal) => {
                        hintBtn.innerText = '정답 보기 (-10점)';
                        hintBtn.style.display = 'inline-block';
                        hintBtn.onclick = () => {
                            if (confirm("이 단계에서는 힌트 없이 바로 정답을 알려주며 10점이 감점됩니다. 정말 보시겠습니까?")) {
                                modal.updateScore(-10);
                                hintDisplay.innerText = `정답: 가, 나, 라`;
                                hintDisplay.style.display = 'block';
                                hintBtn.style.display = 'none';
                            }
                        };
                    },
                    onSubmit: (el, gm) => {
                        const checked = Array.from(el.querySelectorAll('input:checked')).map(i => i.value);
                        if (checked.includes("1") && checked.includes("2") && checked.includes("4") && checked.length === 3) {
                            gm.updateScore(10);
                            gm.state.flags.c_panel_fixed = true;
                            gm.showDialog([
                                "예전에 아빠가 자주 말씀하셨던 내용이라 쉽게 맞출 수 있었어....이제 전기를 쓸 수 있겠어.",
                                "아까 뭐가 안되었더라...다시 방으로 내려가보자"
                            ]);
                            return true;
                        }
                        return false;
                    }
                });
            } else {
                gm.showDialog(["지금은 이 아이템을 사용할 상황이 아닌 것 같다."]);
            }
        },
        'item_02_hangerchief': (gm) => {
            if (gm.state.currentSceneId === 'd_1a_panel_dusty') {
                gm.playVideo('scene/room_d/d_1b_video_panel_cleaning.mp4', () => {
                    gm.loadScene('d_1c_panel_cleaned');
                });
            } else {
                gm.showDialog(["??? ???? ??? ??? ?? ? ??."]);
            }
        },
        'item_03_glass_bottle': (gm) => {
            if (gm.state.currentSceneId === 'e_2a_poop_zoom' && !gm.state.flags.manure_bottle_obtained) {
                gm.playSound('sfx-dynamic', 'scene/yard_e/e_2b_sfx_glass_bottle_input.mp3');
                gm.state.flags.manure_bottle_obtained = true;
                gm.loadScene('e_2b_glass_bottle_input');
                gm.obtainItem('item_10_manure_bottle');
            } else {
                gm.showDialog(["??? ???? ??? ??? ?? ? ??."]);
            }
        },
        'item_04_album': (gm) => {
            if (!gm.state.inventory.includes('item_06_photo_piece')) {
                gm.showDialog(["사진 조각이 하나 비어있는 앨범이다. 조각을 먼저 찾아야 해."]);
                // 단독 확대만 보여줌
                gm.elements.itemZoomImg.src = `scene/inventory/item_04_album.png`;
                gm.elements.itemZoomLayer.style.display = 'flex';
            } else {
                gm.showDialog(["사진 조각을 앨범에 끼웠다."]);
                // 여기서 원래는 b_3c_s1_left_only 씬으로 전환해야함
                // 시연을 위해 카드키 획득 처리
                gm.obtainItem('item_07_card_key');
            }
        },
        'item_05_water_cup': (gm) => {
            if (gm.state.currentSceneId === 'c_1b_freezer_open') {
                gm.showDialog(["빈 컵으로는 얼음을 녹일 수 없다. 뜨거운 물을 받아와야 해."]);
            } else {
                gm.showDialog(["아직 비어있는 컵이다."]);
            }
        },
        'item_08_hot_water_cup': (gm) => {
            if (gm.state.currentSceneId === 'c_1b_freezer_open' && !gm.state.flags.car_key_obtained) {
                gm.playSound('sfx-dynamic', 'scene/room_c/c_1c_sfx_melting.mp3');
                gm.showDialog(["얼음이 녹았다! 차키를 얻었다."], () => {
                    gm.state.flags.car_key_obtained = true;
                    gm.obtainItem('item_09_car_key');
                });
            } else {
                gm.showDialog(["뜨거운 물을 아무데나 부을 순 없어."]);
            }
        },
        'item_10_manure_bottle': (gm) => {
            if (gm.state.currentSceneId === 'e_3a_poop_machine' && !gm.state.flags.e3_machine_active) {
                gm.playVideo('scene/yard_e/e_3b_video_poop_machine.mp4', () => {
                    gm.playSound('sfx-dynamic', 'scene/yard_e/e_3b1_sfx_machine_active.wav');
                    gm.state.flags.e3_machine_active = true;
                    gm.loadScene('e_3c_machine_active');
                });
            } else {
                gm.showDialog(["??? ? ??? ??? ??? ?? ? ??."]);
            }
        },
        'item_09_car_key': (gm) => {
            if (gm.state.currentSceneId === 'e_4b_bus_inside' && !gm.state.flags.bus_started) {
                gm.playSound('sfx-dynamic', 'scene/yard_e/e_4b_sfx_bus_inside_key_input.mp3');
                gm.playVideo('scene/yard_e/e_4c_video_bus_activated.mp4', () => {
                    gm.state.flags.bus_started = true;
                    gm.loadScene('e_4d_bus_charged');
                });
            } else {
                gm.showDialog(["여기에 차키를 꽂을 순 없어."]);
            }
        }
    }
};
