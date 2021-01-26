// MIDI setup

//attach a click listener to a play button
document.querySelector('#start')?.addEventListener('click', async () => {
    await Tone.start()
    console.log('audio is ready')
})
//instrument setup
const omni = new Tone.OmniOscillator();
const synth = new Tone.MonoSynth();
const poly = new Tone.PolySynth();
poly.set({
    oscillator : {
        type : "square"
    },
  maxPolyphony : 36,
  volume : -10
});
const filter = new Tone.Filter();
const filterenv = new Tone.FrequencyEnvelope();
filterenv.set({
    baseFrequency : 20
})
// Effects
// Chorus
const chorus = new Tone.Chorus();
// Reverb
const reverb = new Tone.Reverb();
// Tremolo
const tremolo = new Tone.Tremolo();
// Vibrato 
const vibrato = new Tone.Vibrato();
filterenv.connect(filter.frequency)
var effects = [chorus, tremolo, reverb, vibrato]
function effectselector() {
    
}
poly.chain(filter, chorus, reverb, tremolo, vibrato, Tone.Destination);


// Oscilloscope setup
var oscilloscope = new Nexus.Oscilloscope('#oscilloscope')
oscilloscope.connect(poly)
oscilloscope.bufferLength = 64;

// Values recieved from user input
// Wave type for Oscillator
function osc() {
    var wavetype = ["plain", "fm", "am", "fat", "square", "saw", "triangle", "sine", "pwm"];
    var selection = [];
    var checker;
    var i;
    for (i = 0; i < wavetype.length; i++) {
        checker = document.getElementById(wavetype[i])
        if (checker.checked) {
            selection.push(checker.value)
            if (checker.value == "pwm") {
                poly.set({
                    oscillator :{
                      type : checker.value
                    }
                });
                return;
            }
        }}
        poly.set({
            oscillator :{
              type : selection.join("")
            }
        });
    }

// Modulation Options
// Disabling unselected oscillator types
function moddis(){
    var options = ["plain", "fm", "am", "fat", "pwm"];
    var i;
    var checker;
    for (i = 0; i < options.length; i++) {  
        checker = document.getElementById(options[i])
        if(checker.checked) {
            if (options[i] == "fm"){
                document.getElementById("fmfieldset").disabled = false;
            }
            if(options[i] != "fm"){
                document.getElementById("fmfieldset").disabled = true;
            }
            if (options[i] == "am") {
                document.getElementById("amfieldset").disabled = false;
            }
            if(options[i] != "am") {
                document.getElementById("amfieldset").disabled = true;
            }
            if (options[i] == "fat") {
                document.getElementById("fatfieldset").disabled = false;
            }
            if (options[i] != "fat") {
                document.getElementById("fatfieldset").disabled = true;
            }
            if (options[i] == "pwm") {
                document.getElementById("pwmfieldset").disabled = false;
            }
            if (options[i] != "pwm") {
                document.getElementById("pwmfieldset").disabled = true;
            }
      }
    }
}

// FM options
function fmopt(){
    // Wave modulation selection
    var wavetype = ["fmsquare", "fmsaw", "fmtriangle", "fmsine"];
    var selection = document.getElementById("fm");
    var checker;
    var i;
    if(selection.checked) {
        poly.set({
            oscillator :{
              modulationType : "square"
            }
        });
        for (i = 0; i < wavetype.length; i++) {
        checker = document.getElementById(wavetype[i])
        if (checker.checked) {
            poly.set({
                oscillator :{
                  modulationType : checker.value
                }
            });
        }
        }
    }
    // Index modulation
    var fmindex = document.getElementById("fmindex");
    fmindex.oninput = () => {
      console.log(fmindex.value);
      poly.set({
        oscillator : {
          modulationIndex : this.value
        }
      });
    }
    // Harmonicity modulation   
    var fmharm = document.getElementById("fmharm");
    fmharm.oninput = () => {
      console.log(fmharm.value);
      poly.set({
        oscillator : {
          harmonicity : this.value
        }
      });
    }
    }


// AM options
function amopt(){
    var wavetype = ["amsquare", "amsaw", "amtriangle", "amsine"];
    var selection = document.getElementById("am");
    var checker;
    var i;
    if(selection.checked) {
        poly.set({
            oscillator :{
              modulationType : "square"
            }
        });
        for (i = 0; i < wavetype.length; i++) {
        checker = document.getElementById(wavetype[i])
        if (checker.checked) {
            poly.set({
                oscillator :{
                  modulationType : checker.value
                }
            });
        }
        }
    // harmonicity
    var amharm = document.getElementById("amharm");
    amharm.oninput = () => {
      poly.set({
        oscillator : {
          harmonicity : this.value
        }
      });
    }
    }
}

// FAT options
function FATopt() {
    checker = document.getElementById("fat");
    if (checker.checked) {
        var count = document.getElementById("fatcount");
        console.log(count.value)
        count.oninput = () => {
            poly.set({
                oscillator : {
                    count : this.value
                }
            });
        }
        var detune = document.getElementById("fatmod");
        detune.oninput = () => {
            poly.set({
                oscillator : {
                    spread : this.value
                }
            });
        }
    }

}

// PWM options
function pwmopt() {
    checker = document.getElementById("pwm");
    if (checker.checked) {
        var mod = document.getElementById("pwmmod");
        mod.oninput = () => {
            poly.set({
                oscillator : {
                    modulationFrequency : this.value
                }
            });
            console.log(mod.value)
        }
}
}


// Volume control
var sourcevol = document.getElementById("vol");
sourcevol.oninput = function() {
  poly.set({
    volume : this.value
  });
  }


// Values for Filter
//
// Determine filter type
function filtopt() {
    var types = ["lowpass", "bandpass", "highpass"]
    var i;
    var checker;
    for (i = 0; i < types.length; i++) {
        checker = document.getElementById(types[i]);
        if (checker.checked) {
            filter.set({
                type : checker.value
            })
        }
    }
}

// Determine Roll-off
function rollopt() {
    var roll = ["r12", "r24", "r48", "r96"]
    var i;
    var checker;
    for (i = 0; i < roll.length; i++) {
        checker = document.getElementById(roll[i]);
        if (checker.checked) {
            filter.set({
                rolloff : checker.value
            })
            console.log(checker.value)
        }
    }
}

// Determine cutoff
var cutoff = document.getElementById("cutoff");
cutoff.oninput = function() {
    filter.set({
        frequency : this.value
    })
    }

// Amplitude envelope control
// Attack
var attacka = document.getElementById("attacka");
attacka.oninput = function() {
  poly.set({
      envelope : {
        attack : this.value
      }
    });
}

// Decay
var decaya = document.getElementById("decaya");
decaya.oninput = function() {
  poly.set({
      envelope : {
        decay : this.value
      }
  });
}

// Sustain
var sustaina = document.getElementById("sustaina");
sustaina.oninput = function() {
  poly.set({
      envelope : {
        sustain : this.value
      }
  });
}

// Release
var releasea = document.getElementById("releasea");
releasea.oninput = function() {
  poly.set({
      envelope : {
        release : this.value
      }
  });
}


// Filter envelope control
// Attack
var attackf = document.getElementById("attackf");
attackf.oninput = function() {
    filterenv.set({
        attack : this.value
    })
}

// Decay
var decayf = document.getElementById("decayf");
decayf.oninput = function() {
    filterenv.set({
        decay : this.value
    })
}

// Sustain
var sustainf = document.getElementById("sustainf");
sustainf.oninput = function() {
    filterenv.set({
        sustain : this.value
    })
}

// Release
var releasef = document.getElementById("releasef");
releasef.oninput = function() {
    filterenv.set({
        release : this.value
    })
}

// Effect control
// Chorus
function chorusctr() {
    var depth = document.getElementById("depthchorus");
    var freq = document.getElementById("frequencychorus");
    var delay = document.getElementById("delaychorus");
    var amount = document.getElementById("wetchorus");
    chorus.set({
        depth : depth.value,
        frequency : freq.value,
        delayTime : delay.value,
        wet : amount.value
    });
}

// Reverb
function reverbctr() {
    var decay = document.getElementById("decayreverb");
    var amount = document.getElementById("wetreverb");
    reverb.set({
        decay : decay.value,
        wet : amount.value
    })
}

// Tremolo
function tremoloctr(){
    var depth = document.getElementById("depthtremolo");
    var freq = document.getElementById("freqtremolo");
    var amount = document.getElementById("wettremolo");
    tremolo.set({
        depth : depth.value,
        frequency : freq.value,
        wet : amount.value
    });
}

// Vibrato
function vibratoctr(){
    var depth = document.getElementById("depthvibrato");
    var freq = document.getElementById("freqvibrato");
    var amount = document.getElementById("wetvibrato" );
    vibrato.set({
        depth : depth.value,
        frequency : freq.value,
        wet : amount.value
    });
}

// keyboard keys
var QWERTZ = [
    "a", "w", "s", "e", "d", "f", "t", "g", "z", "h", "u", "j", "k"
];

// transposing
var notes = [
    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"
];
function transposer() {
    var transpose = document.getElementById("transposer");
    var i;
    var note;
    var octave;
    var checker;
    var ccount = 0
    for (i = 0; i < notes.length; i ++) {
        
        octave = transpose.value;
        checker = notes[i];
        if  (checker.charAt(0) == "C" && checker.length < 3) {
            ccount += 1;
        }
        if (ccount >= 2) {
            octave = Number(transpose.value) + 1
        }
        note = notes[i].slice(0,-1) + String(octave);
        notes[i] = note;
    }
}

var pressed = new Set();

document.addEventListener("keydown", (event) => {
    if (QWERTZ.includes(event.key)) {
        pressed.add(event.key);
        if (pressed.has(event.key)) {
            if (event.repeat == true){
                return;
         }
        poly.triggerAttack(notes[QWERTZ.indexOf(event.key)]);
        console.log(poly.activeVoices);
    }
}})
document.addEventListener("keyup", (event) => {
    if (pressed.has(event.key)) {
        pressed.delete(event.key);
        poly.triggerRelease(notes[QWERTZ.indexOf(event.key)]);
    }
    if (pressed.has(event.key) == false) {
        poly.triggerRelease(notes[QWERTZ.indexOf(event.key)]);
    }
})

// testing button
function play(){
    console.log(reverb.get())

  }