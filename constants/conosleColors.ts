export const reset = '\x1b[0m';
export const bright = '\x1b[1m';
export const dim = '\x1b[2m';
export const italic = '\x1b[3m';
export const underscore = '\x1b[4m';

export const blink = '\x1b[5m';
export const reverse = '\x1b[7m';
export const hidden = '\x1b[8m';

export const black = '\x1b[30m';
export const red = '\x1b[31m';
export const green = '\x1b[32m';
export const yellow = '\x1b[33m';
export const blue = '\x1b[34m';
export const magenta = '\x1b[35m';
export const cyan = '\x1b[36m';
export const white = '\x1b[37m';

export const BGblack = '\x1b[40m';
export const BGred = '\x1b[41m';
export const BGgreen = '\x1b[42m';
export const BGyellow = '\x1b[43m';
export const BGblue = '\x1b[44m';
export const BGmagenta = '\x1b[45m';
export const BGcyan = '\x1b[46m';
export const BGwhite = '\x1b[47m';


// Credit https://muffinman.io/blog/nodejs-simple-colorful-logging/
export const ccolors = {
  green: (text: string) => console.log("\x1b[32m" + text + reset),
  red: (text: string) => console.log("\x1b[31m" + text + reset),
  blue: (text: string) => console.log("\x1b[34m" + text + reset),
  yellow: (text: string) => console.log("\x1b[33m" + text + reset),
  italic: (text: string) => console.log("\x1b[3m" + text + reset),

  strings: {
    green: "\x1b[32m" + reset,
    red: "\x1b[31m" + reset,
    blue: "\x1b[34m" + reset,
    yellow: "\x1b[33m" + reset,
    italic: "\x1b[3m" + reset,
  }
};


