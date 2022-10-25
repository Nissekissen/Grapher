class Graph {
    constructor(formula, minX, maxX) {
        // Formula syntax example: 2x+4
        // Split formula into characters.
        // handle character via function
        // output a function with that takes in x and returns y.
        const chars = formula.split("");
        
        this.handleX = (x) => {
            let mulitpliers = [];
            let numberPart = "";
            let numMode = false;
            let ans = 0;
            let a, b, o;

            for (let i = 0; i < chars.length; i++) {
                let char = chars[i];
                if (char == "x") {
                    char = x;
                }
                if (i == 0) {
                    if (isNaN(char)) throw new Error('Invalid syntax');
                }
                if (!isNaN(chars[i+1]) && !isNaN(chars[i])) {
                    numberPart += char;
                    numMode = true;
                    continue;
                }
                numberPart += char;
                mulitpliers.push(numberPart)
                numberPart = "";
                numMode = true ? !isNaN(char) : false;
                if (i < 2) continue;
                if (isNaN(chars[i-1])) {
                    a = chars[i-2];
                    o = 3;
                    while (o <= i) {
                        if (!isNaN(chars[i-o])) {
                            a = chars[i-o] + a;
                            console.log(b);
                        }
                        o++;
                    }
                    b = char;
                    o = 1;
                    while (o + i < chars.length) {
                        if (!isNaN(chars[i+o])) {
                            b += chars[i+o];
                        }
                        o++;
                    }
                    switch (chars[i-1]) {
                        case "*":
                            ans = parseInt(ans) + (parseInt(a) * parseInt(b));
                            break;
                        case "+":
                            ans = parseInt(ans) + (parseInt(a) + parseInt(b));
                            break;
                    }
                }
                console.log("a: " + a + ", b: " + b + ", i: " + i);
            }
            return ans;
        }

        for (let i = minX; i <= maxX; i++) {
            console.log(this.handleX(i));
        }
    }
}

export default Graph;