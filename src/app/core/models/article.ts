export class Article {
  nr: string;
  artikelid: String;
  varnummer: String;
  namn: String;
  namn2: String;
  prisinklmoms: Number;
  prissanktProcent: Number;
  prisHistorik: Array<any>;
  volymiml: Number;
  prisPerLiter: Number;
  saljstart: Date;
  slutlev: Date;
  varugrupp: String;
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
  ekologisk: String;
  koscher: String;
  slut: false;
  ravarorBeskrivning: String;
  created: string
  lastModified: string
}

export class ReducedResponse {
  date: string;
  count: number;
  articles: Article[];
}
