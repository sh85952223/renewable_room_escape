import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, serverTimestamp } from 'firebase/database';

// 힌트: Firebase 콘솔에서 Realtime Database를 아시아 지역(asia-northeast3)에 생성하셨다면,
// databaseURL 속성을 firebaseConfig에 추가해야 할 수 있습니다.
// 예: databaseURL: "https://renewable-escape-room-default-rtdb.asia-southeast1.firebasedatabase.app"

const firebaseConfig = {
  projectId: "renewable-escape-room",
  appId: "1:820797826107:web:144934388e5d998685e81e",
  storageBucket: "renewable-escape-room.firebasestorage.app",
  apiKey: "AIzaSyAlFWAsmf4izF2d8as5Szcc9QyAalEx8e0",
  authDomain: "renewable-escape-room.firebaseapp.com",
  messagingSenderId: "820797826107"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export const saveGameResult = async (playerId, score, playTimeSecs) => {
    try {
        const recordsRef = ref(db, 'records');
        const newRecordRef = push(recordsRef);
        
        const minutes = Math.floor(playTimeSecs / 60);
        const seconds = playTimeSecs % 60;
        const formattedTime = `${minutes}분 ${seconds}초`;

        await set(newRecordRef, {
            playerId: playerId,
            score: score,
            playTimeSecs: playTimeSecs,
            playTimeFormatted: formattedTime,
            timestamp: serverTimestamp()
        });
        console.log('Game result saved successfully!');
        return true;
    } catch (e) {
        console.error('Error saving game result: ', e);
        return false;
    }
};
