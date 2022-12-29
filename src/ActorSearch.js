import React, { useEffect, useState } from "react";
import { Form, Button, Image } from "react-bootstrap";

const ActorSearch = () => {
  const [name, setName] = useState("");
  const [actorData, setActorData] = useState({});
  const [movies, setMovies] = useState({});

  const handleChange = (e) => {
    setName(e.target.value);
    console.log("firedHandleChange");
  };

  const search = (e) => {
    e.preventDefault();
    const url = `https://online-movie-database.p.rapidapi.com/auto-complete?q=${name}`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "iPxYj0SjxxHJproXNwsgNGBx5rj3yf3a",
        "X-RapidAPI-Host": "online-movie-database.p.rapidapi.com"
      }
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        let sortedData = json.d.sort((a, b) => (a.rank > b.rank ? 1 : -1));
        json.d = sortedData;
        setActorData({
          image: json.d[0].i.imageUrl,
          id: json.d[0].id,
          name: json.d[0].l
        });

        // return json;
        // console.log(json)
      })
      .catch((err) => console.error("error:" + err));
    console.log(actorData);
  };

  const getMovies = () => {
    const url = `https://online-movie-database.p.rapidapi.com/actors/get-all-filmography?nconst=${actorData.id}`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "iPxYj0SjxxHJproXNwsgNGBx5rj3yf3a",
        "X-RapidAPI-Host": "online-movie-database.p.rapidapi.com"
      }
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        const ml = json.filmography.map((item) => ({
          title: item.title,
          id: item.id.slice(7, 16)
        }));
        setMovies(ml);
      })

      .catch((err) => console.error("error:" + err));
    console.log(movies);
  };

  useEffect(() => {
    if (actorData.image !== null) {
      getMovies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actorData]);

  return (
    <>
      <Form onSubmit={search}>
        <Form.Group controlId="actorName">
          <Form.Label>Name of Actor:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit">Search</Button>
      </Form>
      {actorData.name && (
        <>
          <Image
            className="img-thumbnail w-50"
            src={actorData.image}
            alt={`${actorData.name} profile`}
          />
          <p>IMDB ID: {actorData.id}</p>
          {/* <p>Movies:</p>
          {movies.map((movie, index) => (
            <p key={index}>
              {movie.title} - {movie.id}
            </p>
          ))} */}
        </>
      )}
    </>
  );
};

export default ActorSearch;
