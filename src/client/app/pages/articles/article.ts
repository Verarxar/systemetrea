export class Article {
    nr: { type: Number, required: true, unique: true };
    artikelId: String;
    varnummer: String;
    namn: String;
    namn2: String;
    prisinklmoms: Number;
    volymiml: Number;
    prisperliter: Number;
    saljstart: String;
    utgått: String;
    varugrupp: String;
    typ: String;
    stil: String;
    forpackning: String;
    forslutning: String;
    ursprung: String;
    ursprunglandnamn: String;
    producent: String;
    leverantor: String;
    argang: String;
    provadargang: String;
    alkoholhalt: String;
    sortiment: String;
    sortimenttext: String;
    ekologisk: String;
    etiskt: String;
    koscher: String;
    ravarorbeskrivning: String;
    siteData: SiteData;
}

export class SiteData {
    prissanktProcent: Number;
    prishistorik: [
        {
            timestamp: {
                type: Date;
            },
            pris: Number;
        }
    ];
    created: Date;
    lastFound: Date;
}
