import { useEffect, useState } from "react";

import RepositoryItem from "./RepositoryItem";

import "../styles/repositories.scss";

interface IRepository {
  id: string;
  name: string;
  description: string;
  html_url: string;
}

function RepositoryList() {
  const [repositories, setRepositories] = useState<IRepository[]>([]);

  useEffect(() => {
    fetch("https://api.github.com/users/judsonjuniorr/repos")
      .then((response) => response.json())
      .then((response) => setRepositories(response));
  }, []);

  return (
    <section className="repository-list">
      <h1>Lista de repositórios</h1>

      <ul>
        {repositories.map((repository) => (
          <RepositoryItem key={repository.id} repository={repository} />
        ))}
      </ul>
    </section>
  );
}

export default RepositoryList;
