module.exports = {
     legacy,
     current
}

function current() {
     return {
          nr: null,
          artikelid: null,
          varnummer: null,
          namn: null,
          namn2: null,
          prisinklmoms: null,
          volymiml: null,
          prisperliter: null,
          saljstart: null,
          utgatt: null,
          varugrupp: null,
          typ: null,
          stil: null,
          forpackning: null,
          forslutning: null,
          ursprung: null,
          ursprunglandnamn: null,
          producent: null,
          leverantor: null,
          argang: null,
          provadargang: null,
          alkoholhalt: null,
          sortiment: null,
          sortimenttext: null,
          ekologisk: null,
          etiskt: null,
          koscher: null,
          ravarorbeskrivning: null,
          siteData: {}
     }
}
function legacy() {
     return {
          artikelid: null,
          varnummer: null,
          namn: null,
          namn2: null,
          prisinklmoms: null,
          volymiml: null,
          prisperliter: null,
          saljstart: null,
          slutlev: null,
          varugrupp: null,
          forpackning: null,
          forslutning: null,
          ursprung: null,
          ursprunglandnamn: null,
          producent: null,
          leverantor: null,
          argang: null,
          provadargang: null,
          alkoholhalt: null,
          sortiment: null,
          ekologisk: null,
          koscher: null,
          ravarorbeskrivning: null,
          siteData: {}
     }
}