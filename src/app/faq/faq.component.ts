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
          <p>Jag är glad att du frågade! Initialt skapade jag den här sidan med åtanken att dela med mig av den till mina närmsta vänner. Vid några tillfällen fick jag
          såklart frågan om det gick för sig att skicka länken till sidan vidare en av deras vänner, varpå jag naturligtvis välkomnade dessa medlemmar med öppna armar!</p>
          <p>En dag ledde min nyfikenhet mig till att öppna filen "reallycool-log.log" (namnet förblev en placeholder något längre än planerat). Filens syfte var helt enkelt
          att ge mig ett litet hum om hur många unika besökare jag hade i veckan, var det 5? eller kanske rentutav 15? Och det hade varit en bra gissning om jag lagt till
          tre nollor.</p>
          <p>Efter några dagars underhållsarbete (a total - från grunden - 100% omskrivning av varenda rad av kod) så introducerade jag också en chat-funktion och en möjlighet
          för besökarna att betygsätta individuella artiklar. Med en öppen chat m.m så krävs det att någon tar på sig rollen som moderator för att hålla sidan någonlunda ren
          från biprodukter skapade av internetmänniskor (vilket jag varken har tid eller lust till). Om jag istället begränsar vem som får tillgång till sidan så uppstår
          aldrig behovet.</p>
        `
      }, {
        question: 'Vad är det här?',
        reply: `<p>Det här är en sida som presenterar de artiklar som prissänkts på systembolaget; Både inom deras ordinarie sortiment men även på beställningssortimentet</p>`
      }, {
        question: 'Systembolaget har väl aldrig rea?',
        reply: `<p>Korrekt!</p>
        <p>Systembolaget rear inte, samtliga artiklars slutgiltiga pris är ett resultat av en prisberäkningsmodell, om leverantören sänker priset för
        en vara, sänks även priset på hyllan per automatik.</p>`
      }, {
        question: 'Hur ser systembolagets prissänkningsmodell ut?',
        reply: `<p>Kul fråga... All prissättning utgår från inköpspris mellan systembolaget och leverantören för artikeln i fråga.</p>
        <p>Steg 1:<br>
        Inledningsvis räknas alkoholskatten bort från inköpspriset, därefter lägger man på en procentmängd på det avskalade priset. (typ 19%-ish, oavsett dryckestyp)</p>
        <p>Steg 2:<br>
        Sedan utförs ett fast prispåslag, men denna gång är det baserat på varugruppen för artikeln. Påslaget är 3,50 kr för vin, 0,85 kr för öl, etc.</p>
        <p>Steg 3:<br>
        Priset kompletteras med samma summa som man drog bort vid steg 1 då alkoholskatten subtraherades från priset</p>
        <p>Steg 4:<br>
        Momspåslaget och avrundning.</p>`
      }, {
        question: 'Varan jag vill ha finns ju inte i lager någonstans, vad fyller sidan då för funktion?',
        reply: `<p>Utmärkt fråga! Svaret är enkelt: Beställ beställ beställ beställ!</p>
        <p>Majoriteten av de produkter som sänks finns troligen inte ens med på det ordinarie sortimentet.</p>
        <p>Till höger i listan för respektive artikel finns en länk till Systembolagets hemsida, där kan man beställa allt till sin lokala butik om så önskas.
        Undantag är de artiklar som är begränsade till ett visst län på leverantörens begäran.</p>`
      }, {
        question: 'Varför sänker leverantören priset på en vara plötsligt med 50%?',
        reply: `<p>Oftast handlar det om att leverantören i fråga inte längre kommer köpa in mer av just den varan, eller varor från just den producenten - och vill därför
        tömma sitt lager på berörda artiklar för att få plats med annat.</p>
        <p>Ett annat scneario är tex. då artikeln helt enkelt ska byta namn och kanske då även pris,
        då kan varan sänkas för att påskynda processen innan det nya varunamnet dyker upp på hyllan, med samma innehåll, fast 40kr dyrare.</p>`
      }, {
        question: 'Hur sprids informationen om prissänkningar? Hur kan det komma sig att ett antal av de varor som visas här redan är slut?',
        reply: `<p>Systembolaget har ungefär 670 olika leverantörer, när en vara sänks i pris brukar leverantören vara väldigt mån om att meddela detta i sitt nyhetsbrev.</p>
        <p>Då det är på gränsen till orimligt att prenumerera på 670 nyhetsbrev är den här sidan sättet att trots allt hinna först. Ryktet om en stor prissänkning
        kommer naturligtvis att sprida sig väldigt snabbt och alla känner någon som känner någon som prenumererar på just det där nyhetsbrevet.</p>`
      }, {
        question: 'Hur sprids informationen om prissänkningar? Hur kan det komma sig att ett antal av de varor som visas här redan är slut?',
        reply: `<p>Den jämför priset på 18 000 artiklar med priset på 18 000 artiklar nästa dag.</p>`
      }
    ]
  }
}
