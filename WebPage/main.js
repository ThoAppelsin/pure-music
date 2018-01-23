var context;

var baseFreqInput;
var baseFreq;

var lcmLimitInput;
var lcmLimit;
var lastViableOctaveLimit;

var octaveLimitInput;
var octaveLimit;
var lastViableLcmLimit;

var osKeyboard;
var oskEnabled = true;


function sineWaveAt(sampleNumber, sampleFreq) {
    return Math.sin(sampleNumber / (sampleFreq / (Math.PI*2)))
}

function playFrequency(freq, volume) {
    var length = Math.round(context.sampleRate / freq);

    var arrayBuffer = new Float32Array(length);
    for (var i = 0; i < length; i++) {
        arrayBuffer[i] = Math.sin(2 * Math.PI * i / length);
    }

    var audioBuffer = context.createBuffer(1, length, context.sampleRate);
    audioBuffer.copyToChannel(arrayBuffer, 0);

    var source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.loop = true;
    source.start();

    return source;
}

function gcd(a, b)
{
    if (!b) return a;
    return gcd(b, a % b);
}

function calculateFractions() {
    var fractions = [];

    for (var i = 1; i <= lcmLimit; i++) {
        for (var j = 1; j <= lcmLimit; j++) {
            if (gcd(i, j) == 1 && i * j <= lcmLimit && 1 / octaveLimit <= i / j && i / j <= octaveLimit) {
                fractions.push([i, j]);
            }
        }
    }

    fractions.sort(function (a, b) {
        return a[0] / a[1] - b[0] / b[1];
    });

    return fractions;
}

var keys1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
var keys2 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
var keys3 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'];
var keys4 = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'];

var keys = [];

function prepareKeys() {
    var fractions = calculateFractions();

    keys = keys3;

    if (fractions.length > keys.length) {
        keys = keys2.concat(keys);
    }

    if (fractions.length > keys.length) {
        keys = keys.concat(keys4);
    }

    if (fractions.length > keys.length) {
        keys = keys1.concat(keys);
    }

    if (fractions.length > keys.length) {
        alert('Not enough keys for all the fractions!');

        octaveLimitInput.value = lastViableOctaveLimit;
        octaveLimitChange(false);

        lcmLimitInput.value = lastViableLcmLimit;
        lcmLimitChange();

        return;
    }

    lastViableOctaveLimit = octaveLimit;
    lastViableLcmLimit = lcmLimit;

    // There are always odd number of fractions
    var midIndex = Math.round(keys.length / 2);
    var halfWidth = (fractions.length - 1) / 2;

    var sliceBegin = midIndex - halfWidth;
    keys = keys.slice(sliceBegin, sliceBegin + fractions.length);

    for (var i = 0; i < fractions.length; i++) {
        keys[i] = {
            char: keys[i],
            fraction: fractions[i],
            src: null,
            osKey: null,
            
            kbActive: false,
            mouseActive: false,

            selfEval: function () {
                var wasActive = this.src != null;
                var isActive = this.kbActive || this.mouseActive;

                if (wasActive ^ isActive) {
                    if (isActive) {
                        this.src = playFrequency(baseFreq * this.fraction[0] / this.fraction[1]);

                        if (this.osKey) {
                            this.osKey.classList.add('osKeyClicked');
                        }
                    }
                    else {
                        this.src.loop = false;
                        this.src = null;

                        if (this.osKey) {
                            this.osKey.classList.remove('osKeyClicked');
                        }
                    }
                }
            }
        };
    }

    if (oskEnabled) prepareOnScreenKeyboard();
}

function releaseAll() {
    for (var i = 0; i < keys.length; i++) {
        window.onkeyup({key: keys[i].char});
    }
}

window.onkeydown = function(e) {
    var key = e.key ? e.key : e.which;

    for (var i = 0; i < keys.length; i++) {
        if (key == keys[i].char && keys[i].src == null) {
            keys[i].kbActive = true;
            keys[i].selfEval();
        }
    }

    if (key == 'Esc') {
        releaseAll();
    }
}

window.onkeyup = function(e) {
    var key = e.key ? e.key : e.which;

    for (var i = 0; i < keys.length; i++) {
        if (key == keys[i].char && keys[i].src != null) {
            keys[i].kbActive = false;
            keys[i].selfEval();
        }
    }
}

function prepareOnScreenKeyboard() {
    osKeyboard.innerHTML = '';

    function makeNewRow() {
        var osKeyboardRow = document.createElement('div');
        osKeyboardRow.className = 'osKeyboardRow';

        return osKeyboardRow;
    }

    var osKeyboardRow = makeNewRow();

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (key.char == keys2[0] || key.char == keys3[0] || key.char == keys4[0]) {
            osKeyboard.appendChild(osKeyboardRow);
            osKeyboardRow = makeNewRow();
        }

        var osKey = document.createElement('div');
        osKey.className = 'osKey';
        key.osKey = osKey;

        var osKeyChar = document.createElement('div');
        osKeyChar.className = 'osKeyChar';
        osKeyChar.innerHTML = key.char;

        var osKeyFraction = document.createElement('div');
        osKeyFraction.className = 'osKeyFraction';
        osKeyFraction.innerHTML = key.fraction[0] + '/' + key.fraction[1];

        osKey.appendChild(osKeyChar);
        osKey.appendChild(osKeyFraction);

        osKey.onmousedown = (function(key) {
            return function(e) {
                window.onkeydown({key: key.char});
            };
        })(key);
        osKey.ontouchstart = osKey.onmousedown;

        osKey.onmouseup = (function(key) {
            return function(e) {
                window.onkeyup({key: key.char});
            };
        })(key);
        osKey.ontouchend = osKey.onmouseup;

        osKeyboardRow.appendChild(osKey);
    }

    osKeyboard.appendChild(osKeyboardRow);
}

function baseFreqChange() {
    baseFreq = baseFreqInput.value;
}

function lcmLimitChange(prepK = true) {
    lcmLimit = lcmLimitInput.value;
    if (prepK) prepareKeys();
}

function octaveLimitChange(prepK = true) {
    octaveLimit = octaveLimitInput.value;
    if (prepK) prepareKeys();
}

window.onload = function() {
    context = new (window.AudioContext || window.webkitAudioContext)();
    osKeyboard = document.getElementById('osKeyboard');

    baseFreqInput = document.getElementById('baseFreq');
    baseFreqInput.onchange = baseFreqChange;
    baseFreqChange();

    lcmLimitInput = document.getElementById('lcmLimit');
    lcmLimitInput.onchange = lcmLimitChange;
    lcmLimitChange(false);

    octaveLimitInput = document.getElementById('octaveLimit');
    octaveLimitInput.onchange = octaveLimitChange;
    octaveLimitChange();
}