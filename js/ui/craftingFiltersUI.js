const savedCraftingCategory =
  localStorage.getItem(
    "idler_crafting_category",
  );

let currentCraftingCategory =
  savedCraftingCategory || null;

const savedArmorerSubcategory =
  localStorage.getItem(
    "idler_armorer_subcategory",
  );

let currentArmorerSubcategory =
  savedArmorerSubcategory || "all";


const savedTannerSubcategory =
  localStorage.getItem(
    "idler_tanner_subcategory",
  );

let currentTannerSubcategory =
  savedTannerSubcategory || "all";

const savedBowyerSubcategory =
  localStorage.getItem(
    "idler_bowyer_subcategory",
  );

let currentBowyerSubcategory =
  savedBowyerSubcategory || "all";

const savedArcanistSubcategory =
  localStorage.getItem(
    "idler_arcanist_subcategory",
  );

let currentArcanistSubcategory =
  savedArcanistSubcategory || "all";

const savedJewelerSubcategory =
  localStorage.getItem(
    "idler_jeweler_subcategory",
  );

let currentJewelerSubcategory =
  savedJewelerSubcategory || "all";

const savedProfessionToolsSubcategory =
  localStorage.getItem(
    "idler_profession_tools_subcategory",
  );

let currentProfessionToolsSubcategory =
  savedProfessionToolsSubcategory || "all";



function setCraftingCategory(categoryId) {
  currentCraftingCategory = categoryId;

  localStorage.setItem("idler_crafting_category", categoryId);

  renderCrafting();
}

const craftingCategories = [
  {
    id: "metallurgy",
    name: "🔥 Metalurg",
  },

  {
    id: "tanner",
    name: "🧵 Garbarz",
  },

  {
    id: "profession_tools",
    name: "🧰 Narzędzia",
  },

  {
    id: "blacksmith",
    name: "⚔️ Kowal",
  },
  {
    id: "bowyer",
    name: "🏹 Łuczarz",
  },
  {
    id: "arcanist",
    name: "🪄 Arkanista",
  },
  {
    id: "armorer",
    name: "🛡️ Płatnerz",
  },

  {
    id: "jeweler",
    name: "💍 Jubiler",
  },
  {
    id: "shaman",
    name: "🪬 Szaman",
  },
];

const armorerSubcategories = [
  {
    id: "all",
    name: "Wszystko",
  },
  {
    id: "materials",
    name: "🧱 Materiały",
  },
  {
    id: "shield",
    name: "🛡️ Tarcze",
  },
  {
    id: "helmet",
    name: "⛑️ Hełmy",
  },
  {
    id: "armor",
    name: "🥋 Pancerze",
  },
  {
    id: "pants",
    name: "👖 Nogawice",
  },
  {
    id: "boots",
    name: "🥾 Buty",
  },
  {
    id: "gloves",
    name: "🧤 Rękawice",
  },
];

const tannerSubcategories = [
  {
    id: "all",
    name: "Wszystko",
  },
  {
    id: "leather",
    name: "🐺 Skóry",
  },
  {
    id: "fabric",
    name: "🧶 Tkaniny",
  },
];

const professionToolsSubcategories = [
  {
    id: "all",
    name: "Wszystko",
  },
  {
    id: "pickaxe",
    name: "⛏️ Kilofy",
  },
  {
    id: "sickle",
    name: "🌿 Sierpy",
  },
  {
    id: "fishingRod",
    name: "🎣 Wędki",
  },
  {
    id: "alchemyKit",
    name: "⚗️ Alchemia",
  },
  {
    id: "cookingTools",
    name: "🍳 Gotowanie",
  },
  {
    id: "craftingHammer",
    name: "🔨 Młoty",
  },
];

const bowyerSubcategories = [
  {
    id: "all",
    name: "Wszystko",
  },
  {
    id: "bow",
    name: "🏹 Łuki",
  },
  {
    id: "crossbow",
    name: "🎯 Kusze",
  },
];

const arcanistSubcategories = [
  {
    id: "all",
    name: "Wszystko",
  },
  {
    id: "wand",
    name: "🪄 Różdżki",
  },
  {
    id: "staff",
    name: "🔮 Kostury",
  },
];

const jewelerSubcategories = [
  {
    id: "all",
    name: "Wszystko",
  },
  {
    id: "ring",
    name: "💍 Pierścienie",
  },
  {
    id: "amulet",
    name: "📿 Amulety",
  },
];

function getArmorerSubcategory(recipe) {
  const resultItem =
    items[recipe.resultItemId];

  if (!resultItem) {
    return null;
  }

  if (
    recipe.resultItemId ===
    "chitin_plate"
  ) {
    return "materials";
  }

  const supportedItemTypes = [
    "shield",
    "helmet",
    "armor",
    "pants",
    "boots",
    "gloves",
  ];

  if (
    supportedItemTypes.includes(
      resultItem.type,
    )
  ) {
    return resultItem.type;
  }

  return null;
}

function setArmorerSubcategory(
  subcategoryId,
) {
  const subcategoryExists =
    armorerSubcategories.some(
      (subcategory) => {
        return (
          subcategory.id ===
          subcategoryId
        );
      },
    );

  if (!subcategoryExists) {
    return;
  }

  currentArmorerSubcategory =
    subcategoryId;

  localStorage.setItem(
    "idler_armorer_subcategory",
    subcategoryId,
  );

  renderCrafting();
}

function getTannerSubcategory(recipe) {
  if (!recipe) {
    return null;
  }

  return recipe.subcategory || null;
}

function setTannerSubcategory(
  subcategoryId,
) {
  const subcategoryExists =
    tannerSubcategories.some(
      (subcategory) => {
        return (
          subcategory.id ===
          subcategoryId
        );
      },
    );

  if (!subcategoryExists) {
    return;
  }

  currentTannerSubcategory =
    subcategoryId;

  localStorage.setItem(
    "idler_tanner_subcategory",
    subcategoryId,
  );

  renderCrafting();
}

function getProfessionToolsSubcategory(
  recipe,
) {
  if (!recipe) {
    return null;
  }

  return recipe.subcategory || null;
}

function setProfessionToolsSubcategory(
  subcategoryId,
) {
  const subcategoryExists =
    professionToolsSubcategories.some(
      (subcategory) => {
        return (
          subcategory.id ===
          subcategoryId
        );
      },
    );

  if (!subcategoryExists) {
    return;
  }

  currentProfessionToolsSubcategory =
    subcategoryId;

  localStorage.setItem(
    "idler_profession_tools_subcategory",
    subcategoryId,
  );

  renderCrafting();
}

function getBowyerSubcategory(recipe) {
  if (!recipe) {
    return null;
  }

  return recipe.subcategory || null;
}

function setBowyerSubcategory(
  subcategoryId,
) {
  const subcategoryExists =
    bowyerSubcategories.some(
      (subcategory) => {
        return (
          subcategory.id ===
          subcategoryId
        );
      },
    );

  if (!subcategoryExists) {
    return;
  }

  currentBowyerSubcategory =
    subcategoryId;

  localStorage.setItem(
    "idler_bowyer_subcategory",
    subcategoryId,
  );

  renderCrafting();
}

function getArcanistSubcategory(
  recipe,
) {
  if (!recipe) {
    return null;
  }

  return recipe.subcategory || null;
}

function setArcanistSubcategory(
  subcategoryId,
) {
  const subcategoryExists =
    arcanistSubcategories.some(
      (subcategory) => {
        return (
          subcategory.id ===
          subcategoryId
        );
      },
    );

  if (!subcategoryExists) {
    return;
  }

  currentArcanistSubcategory =
    subcategoryId;

  localStorage.setItem(
    "idler_arcanist_subcategory",
    subcategoryId,
  );

  renderCrafting();
}

function getJewelerSubcategory(
  recipe,
) {
  if (!recipe) {
    return null;
  }

  const resultItem =
    items[recipe.resultItemId];

  if (!resultItem) {
    return null;
  }

  if (
    resultItem.type === "ring" ||
    resultItem.type === "amulet"
  ) {
    return resultItem.type;
  }

  return null;
}

function setJewelerSubcategory(
  subcategoryId,
) {
  const subcategoryExists =
    jewelerSubcategories.some(
      (subcategory) => {
        return (
          subcategory.id ===
          subcategoryId
        );
      },
    );

  if (!subcategoryExists) {
    return;
  }

  currentJewelerSubcategory =
    subcategoryId;

  localStorage.setItem(
    "idler_jeweler_subcategory",
    subcategoryId,
  );

  renderCrafting();
}

const craftingSubcategoryConfigs = {
  armorer: {
    subcategories:
      armorerSubcategories,

    getCurrentSubcategory: () =>
      currentArmorerSubcategory,

    getSubcategory:
      getArmorerSubcategory,

    setSubcategory:
      setArmorerSubcategory,
  },

  tanner: {
    subcategories:
      tannerSubcategories,

    getCurrentSubcategory: () =>
      currentTannerSubcategory,

    getSubcategory:
      getTannerSubcategory,

    setSubcategory:
      setTannerSubcategory,
  },

  profession_tools: {
    subcategories:
      professionToolsSubcategories,

    getCurrentSubcategory: () =>
      currentProfessionToolsSubcategory,

    getSubcategory:
      getProfessionToolsSubcategory,

    setSubcategory:
      setProfessionToolsSubcategory,
  },

  bowyer: {
    subcategories:
      bowyerSubcategories,

    getCurrentSubcategory: () =>
      currentBowyerSubcategory,

    getSubcategory:
      getBowyerSubcategory,

    setSubcategory:
      setBowyerSubcategory,
  },

  arcanist: {
    subcategories:
      arcanistSubcategories,

    getCurrentSubcategory: () =>
      currentArcanistSubcategory,

    getSubcategory:
      getArcanistSubcategory,

    setSubcategory:
      setArcanistSubcategory,
  },

  jeweler: {
    subcategories:
      jewelerSubcategories,

    getCurrentSubcategory: () =>
      currentJewelerSubcategory,

    getSubcategory:
      getJewelerSubcategory,

    setSubcategory:
      setJewelerSubcategory,
  },
};

function getCraftingCategory(recipe) {
  const resultItem =
    items[recipe.resultItemId];

  if (!resultItem) {
    return null;
  }

  // Materiały mają kategorię wpisaną
  // bezpośrednio w recepturze.
  if (recipe.category) {
    return recipe.category;
  }

  // Rodzaj broni określa jej wykonawcę.
  if (resultItem.type === "weapon") {
    if (resultItem.weaponType === "ranged") {
      return "bowyer";
    }

    if (resultItem.weaponType === "magic") {
      return "arcanist";
    }

    return "blacksmith";
  }

  const categoryByItemType = {
    shield: "armorer",
    helmet: "armorer",
    armor: "armorer",
    pants: "armorer",
    boots: "armorer",
    gloves: "armorer",

    ring: "jeweler",
    amulet: "jeweler",

    talisman: "shaman",
  };

  return (
    categoryByItemType[resultItem.type] ||
    null
  );
}

function renderCraftingSubcategoryTabs(
  container,
  categoryId,
) {
  const config =
    craftingSubcategoryConfigs[
    categoryId
    ];

  if (!config) {
    return;
  }

  const subcategories =
    config.subcategories;

  const currentSubcategory =
    config.getCurrentSubcategory();

  const getSubcategory =
    config.getSubcategory;

  const setSubcategory =
    config.setSubcategory;
  if (
    currentCraftingCategory !==
    categoryId
  ) {
    return;
  }

  const categoryRecipes =
    recipes.filter((recipe) => {
      return (
        getCraftingCategory(recipe) ===
        categoryId
      );
    });

  const tabs =
    document.createElement("div");

  tabs.className =
    "hero-tabs crafting-subcategory-tabs";

  subcategories.forEach(
    (subcategory) => {
      const recipesCount =
        subcategory.id === "all"
          ? categoryRecipes.length
          : categoryRecipes.filter(
            (recipe) => {
              return (
                getSubcategory(recipe) ===
                subcategory.id
              );
            },
          ).length;

      if (recipesCount === 0) {
        return;
      }

      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "hero-tab-button crafting-subcategory-button";

      button.textContent =
        subcategory.name +
        " (" +
        recipesCount +
        ")";

      if (
        subcategory.id ===
        currentSubcategory
      ) {
        button.classList.add("active");
      }

      button.addEventListener(
        "click",
        () => {
          setSubcategory(
            subcategory.id,
          );
        },
      );

      tabs.appendChild(button);
    },
  );

  container.appendChild(tabs);
}

function filterCraftingRecipesBySubcategory(
  categoryId,
  categoryRecipes,
) {
  const config =
    craftingSubcategoryConfigs[
    categoryId
    ];

  /*
   * Ta kategoria nie ma
   * podkategorii.
   */
  if (!config) {
    return categoryRecipes;
  }

  const currentSubcategory =
    config.getCurrentSubcategory();

  /*
   * Przy opcji „Wszystko”
   * niczego nie odrzucamy.
   */
  if (
    currentSubcategory === "all"
  ) {
    return categoryRecipes;
  }

  return categoryRecipes.filter(
    (recipe) => {
      return (
        config.getSubcategory(
          recipe,
        ) === currentSubcategory
      );
    },
  );
}
