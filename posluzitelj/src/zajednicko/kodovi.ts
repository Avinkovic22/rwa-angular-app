import crypto from "crypto";

export function kreirajSHA256(tekst : string, sol? : string) {
    if(sol) {
        return kreirajSHA256SaSoli(tekst, sol);
    }
    return kreirajSHA256BezSoli(tekst);
}

function kreirajSHA256BezSoli(tekst : string) {
    const hash = crypto.createHash("sha256");
    hash.write(tekst);
    let izlaz = hash.digest("hex");
    hash.end();
    return izlaz;
}

function kreirajSHA256SaSoli(tekst : string, sol : string) {
    const hash = crypto.createHash("sha256");
    hash.write(tekst + sol);
    let izlaz = hash.digest("hex");
    hash.end();
    return izlaz;
}