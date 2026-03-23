// Jeopardy questions — 5 difficulty levels per category
// 100 = let, 200 = middel-let, 300 = middel, 400 = svær, 500 = expert

const JEOPARDY_CATEGORIES = [
  {
    name: "80'er Klassikere",
    icon: "💿",
    questions: [
      { points: 100, q: "Hvilket norsk band sang 'Take On Me'?", a: "a-ha", options: ["a-ha", "Duran Duran", "Depeche Mode", "Erasure"] },
      { points: 200, q: "Hvem sang 'Purple Rain' i 1984?", a: "Prince", options: ["Michael Jackson", "Prince", "David Bowie", "George Michael"] },
      { points: 300, q: "Hvilket band sang 'The Final Countdown' — og hvilket land kommer de fra?", a: "Europe (Sverige)", options: ["Europe (Sverige)", "Scorpions (Tyskland)", "Accept (Tyskland)", "Whitesnake (England)"] },
      { points: 400, q: "Hvilket Dire Straits-album indeholder 'Money for Nothing' og 'Walk of Life'?", a: "Brothers in Arms", options: ["Brothers in Arms", "Love Over Gold", "Making Movies", "Communiqué"] },
      { points: 500, q: "Hvem producerede Michael Jacksons 'Bad'-album fra 1987?", a: "Quincy Jones", options: ["Quincy Jones", "Phil Collins", "Nile Rodgers", "Rick Rubin"] }
    ]
  },
  {
    name: "Dansk Guld",
    icon: "🇩🇰",
    questions: [
      { points: 100, q: "Hvem sang 'Midt Om Natten'?", a: "Kim Larsen", options: ["Kim Larsen", "Thomas Helmig", "TV-2", "Sebastian"] },
      { points: 200, q: "Hvilket dansk band sang 'Kvinde Min' og 'Rabalderstræde'?", a: "Gasolin'", options: ["Gasolin'", "Shu-bi-dua", "Gnags", "Sort Sol"] },
      { points: 300, q: "Hvad hedder forsangeren i TV-2?", a: "Steffen Brandt", options: ["Steffen Brandt", "Michael Falch", "Lars H.U.G.", "Peter A.G."] },
      { points: 400, q: "Hvilket år udgav Aqua 'Barbie Girl'?", a: "1997", options: ["1995", "1996", "1997", "1998"] },
      { points: 500, q: "Hvad hed Gasolin's trommeslager?", a: "Søren Berlev", options: ["Søren Berlev", "Wili Jønsson", "Jes Holtsø", "Poul Bruun"] }
    ]
  },
  {
    name: "Rock Legender",
    icon: "🤘",
    questions: [
      { points: 100, q: "Hvilket band sang 'We Will Rock You'?", a: "Queen", options: ["Queen", "AC/DC", "Kiss", "Aerosmith"] },
      { points: 200, q: "Hvem er forsanger i The Rolling Stones?", a: "Mick Jagger", options: ["Mick Jagger", "Keith Richards", "Roger Daltrey", "Robert Plant"] },
      { points: 300, q: "Hvilket Pink Floyd-album har et prisme på coveret?", a: "The Dark Side of the Moon", options: ["The Dark Side of the Moon", "Wish You Were Here", "The Wall", "Animals"] },
      { points: 400, q: "Hvem spillede det berømte guitar-solo på Hotel California?", a: "Don Felder og Joe Walsh", options: ["Don Felder og Joe Walsh", "Glenn Frey", "Randy Meisner", "Bernie Leadon"] },
      { points: 500, q: "Led Zeppelins 'Stairway to Heaven' blev aldrig udgivet som single. Hvilket album er den fra?", a: "Led Zeppelin IV (1971)", options: ["Led Zeppelin IV (1971)", "Houses of the Holy (1973)", "Physical Graffiti (1975)", "Led Zeppelin III (1970)"] }
    ]
  },
  {
    name: "Film & Musik",
    icon: "🎬",
    questions: [
      { points: 100, q: "Celine Dion sang temasangen til hvilken film med Leonardo DiCaprio?", a: "Titanic", options: ["Titanic", "Romeo + Juliet", "The Great Gatsby", "Inception"] },
      { points: 200, q: "Hvem sang 'Eye of the Tiger' fra Rocky III?", a: "Survivor", options: ["Survivor", "Journey", "Foreigner", "Boston"] },
      { points: 300, q: "Hvilken film er 'Don't You (Forget About Me)' af Simple Minds fra?", a: "The Breakfast Club", options: ["The Breakfast Club", "Pretty in Pink", "Ferris Bueller's Day Off", "Sixteen Candles"] },
      { points: 400, q: "Hvem komponerede hele soundtracket til 'Pulp Fiction' — instruktør der valgte alle numre?", a: "Quentin Tarantino", options: ["Quentin Tarantino", "Hans Zimmer", "Danny Elfman", "Ennio Morricone"] },
      { points: 500, q: "Hvilken klassisk Hitchcock-film har et berømt brusebads-tema komponeret af Bernard Herrmann?", a: "Psycho", options: ["Psycho", "Vertigo", "The Birds", "Rear Window"] }
    ]
  },
  {
    name: "90'er Nostalgi",
    icon: "📼",
    questions: [
      { points: 100, q: "Hvilket band sang 'Wannabe' — 'I'll tell you what I want...'?", a: "Spice Girls", options: ["Spice Girls", "All Saints", "Destiny's Child", "TLC"] },
      { points: 200, q: "Hvem sang 'Smells Like Teen Spirit'?", a: "Nirvana", options: ["Nirvana", "Pearl Jam", "Soundgarden", "Alice in Chains"] },
      { points: 300, q: "Hvilket Oasis-album indeholder både 'Wonderwall' og 'Don't Look Back in Anger'?", a: "(What's the Story) Morning Glory?", options: ["(What's the Story) Morning Glory?", "Definitely Maybe", "Be Here Now", "Standing on the Shoulder of Giants"] },
      { points: 400, q: "Hvem var den originale forsanger i Stone Temple Pilots?", a: "Scott Weiland", options: ["Scott Weiland", "Chris Cornell", "Layne Staley", "Eddie Vedder"] },
      { points: 500, q: "Radioheads 'OK Computer' blev indspillet i hvilket berømt engelsk landhus?", a: "St Catherine's Court (Jane Seymours hus)", options: ["St Catherine's Court (Jane Seymours hus)", "Abbey Road Studios", "Rockfield Studios", "Olympic Studios"] }
    ]
  },
  {
    name: "Disco & Funk",
    icon: "🕺",
    questions: [
      { points: 100, q: "Hvilket band sang 'Dancing Queen'?", a: "ABBA", options: ["ABBA", "Bee Gees", "Boney M", "Donna Summer"] },
      { points: 200, q: "Hvem sang 'I Will Survive'?", a: "Gloria Gaynor", options: ["Gloria Gaynor", "Donna Summer", "Diana Ross", "Cher"] },
      { points: 300, q: "Hvilket band sang 'September' og 'Boogie Wonderland'?", a: "Earth, Wind & Fire", options: ["Earth, Wind & Fire", "Kool & the Gang", "Chic", "The Commodores"] },
      { points: 400, q: "Hvem producerede Chics 'Le Freak' og 'Good Times' — og producerede senere for Bowie og Madonna?", a: "Nile Rodgers", options: ["Nile Rodgers", "Giorgio Moroder", "Quincy Jones", "Bernard Edwards"] },
      { points: 500, q: "Hvilket Bee Gees-nummer var det første der blev indspillet til Saturday Night Fever-soundtracket?", a: "Stayin' Alive", options: ["Stayin' Alive", "How Deep Is Your Love", "Night Fever", "More Than a Woman"] }
    ]
  },
  {
    name: "Sangtekster",
    icon: "📝",
    questions: [
      { points: 100, q: "'We will, we will rock you!' — hvilket band?", a: "Queen", options: ["Queen", "AC/DC", "Guns N' Roses", "Bon Jovi"] },
      { points: 200, q: "'Hello, is it me you're looking for?' — hvem synger?", a: "Lionel Richie", options: ["Lionel Richie", "Adele", "Phil Collins", "Stevie Wonder"] },
      { points: 300, q: "'I see a red door and I want it painted black' — hvilken sang?", a: "Paint It Black – The Rolling Stones", options: ["Paint It Black – The Rolling Stones", "Back in Black – AC/DC", "Black Dog – Led Zeppelin", "Blackbird – The Beatles"] },
      { points: 400, q: "'Nærmest lykkelig gik jeg ned ad gaden' — hvilken sang og hvilket band?", a: "Nærmest Lykkelig – TV-2", options: ["Nærmest Lykkelig – TV-2", "Floden – Lars H.U.G.", "Sommer i Europa – Thomas Helmig", "Elskere i Natten – Tøsedrengene"] },
      { points: 500, q: "'I've seen things you people wouldn't believe' er fra Blade Runner — men hvilken kunstner samplede denne linje i nummeret 'Tears in Rain'?", a: "Vangelis (original score)", options: ["Vangelis (original score)", "Depeche Mode", "Gary Numan", "Moby"] }
    ]
  },
  {
    name: "One-Hit Wonders",
    icon: "⭐",
    questions: [
      { points: 100, q: "Hvem sang 'Macarena'?", a: "Los del Río", options: ["Los del Río", "Ricky Martin", "Shakira", "Lou Bega"] },
      { points: 200, q: "Hvem sang 'Ice Ice Baby'?", a: "Vanilla Ice", options: ["Vanilla Ice", "MC Hammer", "Snow", "Kriss Kross"] },
      { points: 300, q: "Hvem sang '99 Luftballons'?", a: "Nena", options: ["Nena", "Falco", "Nina Hagen", "Kraftwerk"] },
      { points: 400, q: "Hvem sang 'Video Killed the Radio Star' — det første nummer vist på MTV?", a: "The Buggles", options: ["The Buggles", "Devo", "Gary Numan", "Thomas Dolby"] },
      { points: 500, q: "Hvem sang 'In the Year 2525' — en #1 hit i 1969 der beskrev fremtiden?", a: "Zager and Evans", options: ["Zager and Evans", "The Buggles", "Norman Greenbaum", "Steam"] }
    ]
  },
  {
    name: "Band-medlemmer",
    icon: "🎭",
    questions: [
      { points: 100, q: "Hvem er trommeslager i Metallica?", a: "Lars Ulrich", options: ["Lars Ulrich", "Dave Lombardo", "Neil Peart", "Dave Grohl"] },
      { points: 200, q: "Hvem er bassist i Red Hot Chili Peppers?", a: "Flea", options: ["Flea", "Les Claypool", "Mike Dirnt", "Duff McKagan"] },
      { points: 300, q: "Hvem erstattede Peter Gabriel som forsanger i Genesis?", a: "Phil Collins", options: ["Phil Collins", "Steve Hackett", "Tony Banks", "Mike Rutherford"] },
      { points: 400, q: "Hvem var den originale guitarist i Black Sabbath, før han forlod bandet?", a: "Tony Iommi forlod aldrig — det var Ozzy der blev fyret", options: ["Tony Iommi forlod aldrig — det var Ozzy der blev fyret", "Tony Iommi", "Geezer Butler", "Bill Ward"] },
      { points: 500, q: "Hvem spillede keyboard på The Doors' numre — da bandet ikke havde en bassist?", a: "Ray Manzarek (spillede bas med venstre hånd)", options: ["Ray Manzarek (spillede bas med venstre hånd)", "Jon Lord", "Rick Wakeman", "Keith Emerson"] }
    ]
  },
  {
    name: "Årtalsquiz",
    icon: "📅",
    questions: [
      { points: 100, q: "I hvilket årti blev 'Bohemian Rhapsody' udgivet?", a: "1970'erne (1975)", options: ["1970'erne (1975)", "1960'erne", "1980'erne", "1990'erne"] },
      { points: 200, q: "Hvilket år blev MTV lanceret?", a: "1981", options: ["1979", "1981", "1983", "1985"] },
      { points: 300, q: "Hvilket år udgav Nirvana 'Nevermind'?", a: "1991", options: ["1989", "1990", "1991", "1992"] },
      { points: 400, q: "Hvilket år fandt Woodstock-festivalen sted?", a: "1969", options: ["1967", "1968", "1969", "1970"] },
      { points: 500, q: "Hvilket år udgav The Beatles deres sidste studiealbum 'Let It Be' — og hvilket album blev faktisk indspillet sidst?", a: "Let It Be (1970), men Abbey Road (1969) blev indspillet sidst", options: ["Let It Be (1970), men Abbey Road (1969) blev indspillet sidst", "Let It Be var det sidste i begge", "Abbey Road var det sidste i begge", "Sgt. Pepper's var det sidste"] }
    ]
  },
  {
    name: "Covers & Originaler",
    icon: "🔄",
    questions: [
      { points: 100, q: "Hvem sang den originale 'I Will Always Love You' — før Whitney Houston?", a: "Dolly Parton", options: ["Dolly Parton", "Linda Ronstadt", "Patsy Cline", "Tammy Wynette"] },
      { points: 200, q: "Jimi Hendrix' version af 'All Along the Watchtower' — hvem skrev originalen?", a: "Bob Dylan", options: ["Bob Dylan", "Neil Young", "Leonard Cohen", "Van Morrison"] },
      { points: 300, q: "Jeff Buckley lavede en berømt version af 'Hallelujah' — hvem skrev den?", a: "Leonard Cohen", options: ["Leonard Cohen", "Bob Dylan", "Jeff Buckley selv", "Nick Cave"] },
      { points: 400, q: "'Hurt' af Johnny Cash er et cover — hvilket band skrev originalen?", a: "Nine Inch Nails", options: ["Nine Inch Nails", "Depeche Mode", "Tool", "Radiohead"] },
      { points: 500, q: "Soft Cells 'Tainted Love' er et cover af en 1964-sang. Hvem sang originalen?", a: "Gloria Jones", options: ["Gloria Jones", "Ruth Brown", "Dusty Springfield", "Dionne Warwick"] }
    ]
  },
  {
    name: "Instrumenter",
    icon: "🎸",
    questions: [
      { points: 100, q: "Hvilket instrument er Elton John mest kendt for?", a: "Klaver", options: ["Klaver", "Guitar", "Saxofon", "Trommer"] },
      { points: 200, q: "Hvad hedder Eric Claptons berømte sorte Fender-guitar?", a: "Blackie", options: ["Blackie", "Lucille", "Trigger", "Old Black"] },
      { points: 300, q: "Hvilket instrument spillede Jimi Hendrix — og med hvilken hånd (usædvanligt)?", a: "Guitar, venstreåndet (spillede en omvendt højrehåndguitar)", options: ["Guitar, venstreåndet (spillede en omvendt højrehåndguitar)", "Guitar, højrehåndet", "Bas, venstreåndet", "Guitar, begge hænder"] },
      { points: 400, q: "Hvad hedder B.B. Kings guitar?", a: "Lucille", options: ["Lucille", "Blackie", "Trigger", "Stella"] },
      { points: 500, q: "Brian May fra Queen byggede sin guitar 'Red Special' selv. Hvad var den delvist lavet af?", a: "Et gammelt kaminstykke (pejshylde af mahogni)", options: ["Et gammelt kaminstykke (pejshylde af mahogni)", "En gammel dør", "Jernbaneskinner", "En båd"] }
    ]
  }
];
