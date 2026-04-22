import React from "react";
import Hero from "../components/Hero";
import CardList from "../components/CardList";
import Footer from "../components/Footer";

const Homepage = () => {
  return (
    <div className="p-5">
      <Hero />

      <section id="now-playing">
        <CardList title="Now Playing" category="now_playing" />
      </section>

      <section id="top-rated">
        <CardList title="Top Rated" category="top_rated" />
      </section>

      <section id="popular">
        <CardList title="Popular" category="popular" />
      </section>

      <section id="upcoming">
        <CardList title="Upcoming" category="upcoming" />
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;