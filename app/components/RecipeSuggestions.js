import React, { useState } from "react";

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_LLAMA_KEY;

const RecipeSuggestions = ({ pantryItems }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct",
            messages: [
              {
                role: "user",
                content: `Generate at least 3 recipes using the following ingredients: ${pantryItems
                  .map((item) => `${item.amount} ${item.name}`)
                  .join(", ")} and explain them in 5 lines.`,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const rawRecipes = data.choices[0].message.content;

      // Split into recipes and remove asterisks and unwanted characters
      const recipeSections = rawRecipes
        .split(/Recipe \d+:/)
        .filter((section) => section.trim() !== "");

      const formattedRecipes = recipeSections.map((section) => {
        const [title, ...steps] = section
          .split("\n")
          .filter((line) => line.trim() !== "");
        return {
          title: title.replace(/\*/g, "").trim(), // Remove asterisks from title
          steps: steps
            .map((step) => step.replace(/\*/g, "").trim())
            .filter((step) => step !== ""), // Remove asterisks from steps
        };
      });

      setRecipes(formattedRecipes);
    } catch (error) {
      console.error("Error generating recipes: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-suggestions">
      <button
        className={`generate-button ${loading ? "loading" : ""}`}
        onClick={generateRecipes}
        disabled={loading || pantryItems.length === 0}
      >
        Generate Recipes
      </button>
      <br />
      <br />
      <br />
      {recipes.length > 0 && (
        <div className="recipe-cards">
          {recipes.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <h3>{recipe.title}</h3>
              {recipe.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="recipe-step">
                  <p>{step}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeSuggestions;
