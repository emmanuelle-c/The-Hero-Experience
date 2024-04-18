/* eslint no-param-reassign: ["error", { "props": false }] */
// import des librairies
import { useState, useEffect } from "react";
import axios from "axios";
import ScrollToTp from "react-scroll-to-top";

// import des composants
import HeroCard from "./components/HeroCard/Hero";
import BurgerMenu from "./components/Header/Header";
import IconsBar from "./components/IconsBar/IconsBar";
import SearchBar from "./components/SearchBar/SearchBar";
import Footer from "./components/Footer/Footer";

// import des fichiers style
import "./App.css";

function App() {
  const [allHeroes, setAllHeroes] = useState([]);
  const [displayedHeroes, setDisplayedHeroes] = useState([]);
  const [startIndex, setStartIndex] = useState(12);
  const [search, setSearch] = useState("");
  const [filterHeroes, setFilterHeroes] = useState([]);
  const [searchDate, setSearchDate] = useState(new Date());

  // générer une date random :
  function randomDate(start, end) {
    return new Date(+start + Math.random() * (end - start));
  }
  // fetch les données API, suffle les données et afficher seulement 12 par défaut :
  useEffect(() => {
    axios
      .get(
        "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json"
      )
      .then((response) => {
        const data = response.data;
        const shuffledHeroes = data.sort(() => Math.random() - 0.5); // fonction de comparaison aléatoire
        // ajout d'une date random à chaque héro :
        shuffledHeroes.forEach((hero) => {
          hero.date = randomDate(new Date(2024, 4, 30), new Date(2024, 9, 30));
        });
        setAllHeroes(shuffledHeroes);
        setDisplayedHeroes(shuffledHeroes.slice(0, 12)); // charger les 12 premiers héros du tableau qui a été mélangé
        setFilterHeroes(shuffledHeroes);
      });
  }, []);

  // ajouter des héros en affichage 12 par 12 :
  const loadMoreHeroes = () => {
    const endIndex = startIndex + 12; // calculer index de fin pour les suivants
    const nextHeroes = filterHeroes.slice(startIndex, endIndex); // extraire les héros suivants de la liste complète
    // (prevHeroes)contient les premiers héros déjà affichés
    setDisplayedHeroes((prevHeroes) => [...prevHeroes, ...nextHeroes]); // cette syntaxe(...) permet de fusionner les héros précédents avec les suivants sans écraser les 1ers
    setStartIndex(endIndex); // mettre à jour index de départ pour clic suivant
  };
  
  const checkOccupations = (hero, occupations) => {
    let exist = false;
    occupations.forEach((occupation) => {
            if (hero.work.occupation.toLowerCase().includes(occupation)) exist = true;      
    })
    return exist;
  }
  
  const filterHeroesByOccupation = (occupations) => {
    const filteredHeroesWork = allHeroes.filter(hero => checkOccupations(hero, occupations));
    setFilterHeroes(filteredHeroesWork);
    setDisplayedHeroes(filteredHeroesWork);
  };
  // ajouter une propriété "price" à chaque héro du tableau :
  allHeroes.forEach((hero) => {
    hero.price = Number(hero.powerstats.durability + hero.powerstats.strength);
  });

  // faire une recherche par prix :
  const handleClick = () => {
    const filter = allHeroes.filter(
      (hero) =>
        (hero.price >= Number(search) &&
          hero.date.getMonth() > searchDate.getMonth()) ||
        (hero.price >= Number(search) &&
          hero.date.getMonth() === searchDate.getMonth() &&
          hero.date.getDate() >= searchDate.getDate())
    );
    if (filter.length === 0) {
      setFilterHeroes(displayedHeroes);
    } else {
      setFilterHeroes(filter);
      setDisplayedHeroes(filter.slice(0, 12));
    }
  };

  return (
    <div id="app">
      <div>
        <BurgerMenu />
      </div>
      <div className="search-menu">
        <SearchBar
          setSearch={setSearch}
          handleClick={handleClick}
          search={search}
          searchDate={searchDate}
          setSearchDate={setSearchDate}
        />
      </div>
      <IconsBar filterHeroesByOccupation={filterHeroesByOccupation} />
      <div className="hero-container">
        {displayedHeroes.map((hero) => (
          <div className="hero-card" key={hero.id}>
            <HeroCard hero={hero} />
          </div>
        ))}
        <div className="show-more">
          <button onClick={loadMoreHeroes} type="button">
            Voir plus
          </button>
          <div className="scroll">
            <ScrollToTp />
          </div>
        </div>
      </div>
      < Footer />
    </div>
  );
}

export default App;
