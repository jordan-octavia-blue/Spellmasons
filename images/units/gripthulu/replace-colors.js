const fs = require('fs');
const { exec } = require("child_process");
let replaces = [
    [0x86eb83, 0x84d5ec]
    // [0x93d491, 0x90c7cf], //head
    // [0x8fce8e, 0x79b1b9], //head darker slightly
    // [0x86eb83, 0x84d5ec], // light arm
    // [0x74b675, 0x7faaba], // dark arm
    // [0x859784, 0x6e868a], // cloak top
    // // [0x6f866e, 0x5f7377], // cloak medium
    // [0x60775f, 0x516468], //cloak dark
    // [0x374937, 0x374849],//pants
]
replaces = replaces.map(([from, to]) => {
    return [(componentToHex(from)), (componentToHex(to))]
});
console.log('jtest', replaces);
function componentToHex(c) {
    var hex = c.toString(16);
    while (hex.length < 6) {
        hex = '0' + hex;
    }
    return '#' + hex;
}


fs.readdirSync('.').forEach(async file => {
    if (file.endsWith('.png')) {

        // Modify
        for (let [from, to] of replaces) {
            console.log('jtest', from, to)
            const magickCommand = `magick convert ${file} -fuzz 5% -fill ${to} -opaque ${from} ${file}`;
            await new Promise((resolve) => {
                exec(magickCommand, (error, stdout, stderr) => {
                    console.log(file);
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    if (stdout) {
                        console.log(`stdout: ${stdout}`);
                    }
                    resolve();
                });
            })
        }
    }
});
