"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import { PacmanLoader } from "react-spinners";
import { Newspaper, Gamepad2, Trophy, Flame } from "lucide-react";

const News = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [esportsNews, setEsportsNews] = useState([]);
  const [gamingNews, setGamingNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsUrl, setNewsUrl] = useState("");

  axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

  useEffect(() => {
    const fetchNewsUrl = async () => {
      try {
        const response = await axios.get("/api/news");
        setNewsUrl(response.data.newsUrl);
      } catch (error) {
        console.error("Error fetching the news URL:", error);
      }
    };

    fetchNewsUrl();
  }, []);

  useEffect(() => {
    if (newsUrl) {
      const fetchNews = async (category, setter) => {
        try {
          const response = await axios.get(
            `https://gnews.io/api/v4/search?q=${category}&lang=en&country=us&max=10&apikey=${newsUrl}`,
          );
          if (response.status === 200) {
            const articlesWithImages = response.data.articles.filter(
              (article) => article.image,
            );
            setter(articlesWithImages);
          }
        } catch (error) {
          console.error(`Error fetching ${category} news:`, error);
        }
      };

      const fetchAllNews = async () => {
        setIsLoading(true);
        await Promise.all([
          fetchNews("Gaming", setLatestNews),
          fetchNews("Esports", setEsportsNews),
          fetchNews("Gaming News", setGamingNews),
        ]);
        setIsLoading(false);
      };

      fetchAllNews();
    }
  }, [newsUrl]);

  const NewsCard = ({ article, size = "medium", icon: Icon }) => (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative overflow-hidden rounded-3xl bg-gray-900 p-4 transition-all hover:scale-[1.02] ${
        size === "large"
          ? "col-span-2 row-span-2"
          : size === "medium"
            ? "col-span-1 row-span-2"
            : "col-span-1 row-span-1"
      }`}
    >
      <div className="absolute inset-0">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover opacity-40 transition-all group-hover:scale-105 group-hover:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
      </div>
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-gray-800 p-2">
              <Icon className="h-4 w-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-400">
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div>
          <h3 className="mt-4 text-xl font-bold text-white line-clamp-2">
            {article.title}
          </h3>
          {size !== "small" && (
            <p className="mt-2 text-gray-400 line-clamp-2">
              {article.description}
            </p>
          )}
        </div>
      </div>
    </a>
  );

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <PacmanLoader color="white" />
      </div>
    );
  }

  const distributeArticles = (articles, category, icon) => {
    if (!articles.length) return [];
    return articles.map((article, index) => {
      if (index === 0) {
        return (
          <NewsCard
            key={`${category}-${index}`}
            article={article}
            size="large"
            icon={icon}
            category={category}
          />
        );
      } else if ((index - 1) % 3 === 0) {
        return (
          <NewsCard
            key={`${category}-${index}`}
            article={article}
            size="medium"
            icon={icon}
            category={category}
          />
        );
      }
      return (
        <NewsCard
          key={`${category}-${index}`}
          article={article}
          size="small"
          icon={icon}
          category={category}
        />
      );
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[240px]">
        {distributeArticles(latestNews, "Latest News", Flame)}
        {distributeArticles(esportsNews, "Esports", Trophy)}
        {distributeArticles(gamingNews, "Gaming", Gamepad2)}
      </div>
    </div>
  );
};

export default News;
