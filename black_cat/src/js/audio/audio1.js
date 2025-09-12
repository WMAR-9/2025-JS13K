import { floor } from "../basic.js";
import { GameInit } from "../init.js";

let audioCtx = null;
let masterGain;

let oscillators = [];
let isMusicPlaying = false;
let songLength = 0;

const sampleRate = 44100; 
const soundType = ["sawtooth", "square", "triangle", "sine"];
const mainFreq = Array.from({ length: 50 }, (_, i) => 130.81 * Math.pow(2, i / 12));

const songList = ["t", "t", "b", "b", "b", "t", "t", "b", "b"];

const fifthChord = [
    [0, 13, 15, 17, 20, 22],
    [0, 17, 19, 21, 24, 26],
    [0, 20, 22, 24, 27, 29],
    [0, 24, 26, 28, 31, 33],
    [0, 27, 29, 31, 34, 36],
];

const song1 = {
    "t": [
        [2, .4, .3, [[0, 1, 3, 4, 5, 7, 8, 10, 12]], [
            0, 1, 0, 2, 2, 0, 3, 1, 0,
            5, 0, 4, 3, 1, 0, 0, 3, 3,
            0, 4, 4, 0, 2, 0, 1, 1, 0,
            5, 0, 4, 3, 1, 0, 0, 3, 3,
            0, 4, 4, 0, 2, 0, 1, 1, 0,
            5, 0, 4, 3, 0, 1, 2, 0, 0,
        ], .2, .01],
        [3, .8, 1, fifthChord, [
            0, 0, 2, 2, 0, 3,
            0, 3, 0, 0, 2, 0,
            0, 3, 0, 1, 0, 0
        ], .1, 0]
    ],
    "b": [
        [2, 0.3, .3, [[0, 1, 3, 4, 5, 7, 8, 10, 12]], [
            0, 0, 0, 1, 0, 2, 0, 0, 2,
            3, 4, 5, 0, 0, 5, 4, 3, 0,
            0, 2, 2, 0, 1, 0, 1, 1, 0,
            3, 0, 5, 4, 0, 5, 4, 3, 0,
            0, 1, 1, 0, 2, 0, 2, 3, 0,
            0, 3, 4, 5, 0, 5, 4, 0, 0
        ], .2, .01],
        [3, .6, 1, fifthChord, [
            0, 0, 4, 0, 0, 3,
            0, 2, 0, 0, 2, 0,
            0, 3, 0, 1, 0, 0
        ], .1, 0]
    ]
};


async function ensureAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 1; 
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }
    return audioCtx;
}

function soundInitial() {
    oscillators.forEach(osc => osc.forEach(e => e.stop()));
    return [];
}


function playSound(song) {
    if (isMusicPlaying || GameInit.sound) return;
    isMusicPlaying = true;

    ensureAudioCtx();
    oscillators = soundInitial();

    song.forEach(e => {
        const type = soundType[e[0]], notes = e[4], duration = e[2], rythm = e[1], volume = e[5], temp = [];
        let time = audioCtx.currentTime;
        notes.forEach(k => {
            e[3].forEach(l => {
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(masterGain);
                oscillator.type = type;
                oscillator.frequency.value = mainFreq[l[k]];
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(volume, time + e[6] * rythm);
                oscillator.start(time);
                gainNode.gain.exponentialRampToValueAtTime(0.01 * volume, time + duration);
                oscillator.stop(time + duration);
                temp.push(oscillator);
            });
            time += rythm;
        });
        oscillators.push(temp);
    });

    const lastNotes = oscillators[oscillators.length - 1];
    const endNote = lastNotes[lastNotes.length - 1];
    endNote.onended = _ => {
        songLength = (songLength + 1) % songList.length;
        isMusicPlaying = false;
        if (!GameInit.sound) playSound(song1[songList[songLength]]);
    };
}

function playChord() {
    playSound(song1[songList[songLength]]);
}




function createPcmData(f0, f1, a, d, s, r, dur, vol) {
    const n = Math.floor(sampleRate * dur), pcm = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        const t = i / sampleRate, f = f0 + (f1 - f0) * (i / n);
        let env = t < a ? t / a
            : t < a + d ? 1 - (1 - s) * ((t - a) / d)
            : t < a + d + dur - r ? s
            : s * (1 - (t - a - d - dur + r) / r);
        pcm[i] = env * vol * Math.sin(2 * Math.PI * f * t);
    }
    return pcm;
}

const fall = createPcmData(mainFreq[20], mainFreq[10], .1, 1, 0, .5, 1, .2);
const change = createPcmData(mainFreq[40], mainFreq[25], .1, 1, 0, 1, .1, .1);
const jump=createPcmData(mainFreq[5], mainFreq[16],   0, .5, .8, .6, .1, .1);
const zeroup=createPcmData(mainFreq[20], mainFreq[29],   .5, .1, 0, .1, .4, .1);
const home = createPcmData(mainFreq[0], mainFreq[30],   1, 0, .1, .5, .1, .1);

async function playPcmData(pcmData) {
    if (GameInit.sound) return;
    await ensureAudioCtx();
    let buf = audioCtx.createBuffer(1, pcmData.length, sampleRate);
    buf.copyToChannel(pcmData, 0);
    let src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.connect(masterGain);
    src.start();
}

async function play(i) {
    await playPcmData(i == 0 ? jump : i==1?zeroup : i==3? change: i==4?fall:home);
}


async function playToggle() {
    await ensureAudioCtx();
    GameInit.sound = !GameInit.sound;
    masterGain.gain.value = GameInit.sound ? 0 : 1;
}


export {
    play,
    playChord,
    playToggle
};
