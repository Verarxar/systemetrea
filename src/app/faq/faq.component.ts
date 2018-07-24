import { Component, OnInit } from '@angular/core';

class Faq {
  question: string;
  reply: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.less']
})
export class FaqComponent implements OnInit {
  faqList: Faq[];

  constructor() { }

  ngOnInit() {
    this.faqList = this.getQuestions();
  }

  getQuestions() {
    return [
      {
        question: 'Varför måste jag plötsligt logga in?',
        reply: `
          Jag är glad att du frågade! Initialt skapade jag den här sidan med åtanken att dela med mig av den till mina närmsta vänner. Vid några tillfällen fick jag
          såklart frågan om det gick för sig att skicka länken till sidan vidare en av deras vänner, varpå jag naturligtvis välkomnade dessa medlemmar med öppna armar!
          En dag ledde min nyfikenhet mig till att öppna filen "reallycool-log.log" (namnet förblev en placeholder något längre än planerat). Filens syfte var helt enkelt
          att ge mig ett litet hum om hur många unika besökare jag hade i veckan, var det 5? eller kanske rentutav 15? Och det hade varit en bra gissning om jag lagt till
          tre nollor.
          Efter några dagars underhållsarbete (a total - från grunden - 100% omskrivning av varenda rad av kod) så introducerade jag också en chat-funktion och en möjlighet
          för besökarna att betygsätta individuella artiklar. Med en öppen chat m.m så krävs det att någon tar på sig rollen som moderator för att hålla sidan någonlunda ren
          från biprodukter skapade av internetmänniskor (vilket jag varken har tid eller lust till). Om jag istället begränsar vem som får tillgång till sidan så uppstår
          aldrig behovet.
        `
      }, {
        question: 'Vad är det här?',
        reply: `Det här är en sida som presenterar de artiklar som prissänkts på systembolaget; Både inom deras ordinarie sortiment men även på beställningssortimentet`
      }, {
        question: 'Systembolaget har väl aldrig rea?',
        reply: `Korrekt! Systembolaget rear inte, samtliga artiklars slutgiltiga pris är ett resultat av en prisberäkningsmodell, om leverantören sänker priset för
        en vara, sänks även priset på hyllan per automatik.`
      }, {
        question: 'Hur ser systembolagets prissänkningsmodell ut?',
        reply: `Kul fråga... All prissättning utgår från inköpspris mellan systembolaget och leverantören för artikeln i fråga.
        Steg 1:
        Inledningsvis räknas alkoholskatten bort från inköpspriset, därefter lägger man på en procentmängd på det avskalade priset. (typ 19%-ish, oavsett dryckestyp)
        Steg 2:
        Sedan utförs ett fast prispåslag, men denna gång är det baserat på varugruppen för artikeln. Påslaget är 3,50 kr för vin, 0,85 kr för öl, etc.
        Steg 3:
        Priset kompletteras med samma summa som man drog bort vid steg 1 då alkoholskatten subtraherades från priset
        Steg 4:
        Momspåslaget och avrundning.`
      }, {
        question: 'Varan jag vill ha finns ju inte i lager någonstans, vad fyller sidan då för funktion?',
        reply: `Utmärkt fråga! Svaret är enkelt: Beställ beställ beställ beställ! Majoriteten av de produkter som sänks finns troligen inte ens med på det ordinarie sortimentet.
        Till höger i listan för respektive artikel finns en länk till Systembolagets hemsida, där kan man beställa allt till sin lokala butik om så önskas.
        Undantag är de artiklar som är begränsade till ett visst län på leverantörens begäran.`
      }, {
        question: 'Varför sänker leverantören priset på en vara plötsligt med 50%?',
        reply: `Oftast handlar det om att leverantören i fråga inte längre kommer köpa in mer av just den varan, eller varor från just den producenten - och vill därför
        tömma sitt lager på berörda artiklar för att få plats med annat. Ett annat scneario är tex. då artikeln helt enkelt ska byta namn och kanske då även pris,
        då kan varan sänkas för att påskynda processen innan det nya varunamnet dyker upp på hyllan, med samma innehåll, fast 40kr dyrare.`
      }, {
        question: 'Hur sprids informationen om prissänkningar? Hur kan det komma sig att ett antal av de varor som visas här redan är slut?',
        reply: `Systembolaget har ungefär 670 olika leverantörer, när en vara sänks i pris brukar leverantören vara väldigt mån om att meddela detta i sitt nyhetsbrev.<br>
        Då det är på gränsen till orimligt att prenumerera på 670 nyhetsbrev är den här sidan sättet att trots allt hinna först. Ryktet om en stor prissänkning <br>
        kommer naturligtvis att sprida sig väldigt snabbt och alla känner någon som känner någon som prenumererar på just det där nyhetsbrevet.`
      }, {
        question: 'Hur sprids informationen om prissänkningar? Hur kan det komma sig att ett antal av de varor som visas här redan är slut?',
        reply: `Den jämför priset på 18 000 artiklar med priset på 18 000 artiklar nästa dag.`
      }
    ]
  }
}
