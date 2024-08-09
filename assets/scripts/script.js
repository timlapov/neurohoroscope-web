// FOR PROMPT
const STYLES = [
  "Stephen King",
  "Chuck Palanick",
  "Paolo Coelho",
  "L'écrivain russe Vladimir Sorokin",
  "Stephen King",
  "Muriel Barbery",
  "Albert Camus",
  "Guy de Maupassant",
];
//CONSTANTS
const MONTH_SELECTOR = document.getElementById("birth-month");
const DAY_SELECTOR = document.getElementById("birth-day");
const PERIOD_SELECTOR = document.getElementById("period-selector");
const ASPECT_SELECTOR = document.getElementById("aspect-selector");
const P_REQUEST = document.getElementById("request");
const P_RESPONSE = document.getElementById("response");
const SUBMIT_BUTTON = document.getElementById("submit-button");

let usersZodiac = "";
let period = "";
let aspect = "";
let request = "";
let requestToApi = "";
let access_token = "";

//FOR API
let open_api_key = "";
//API-KEY REQUEST
async function initializeApiKey() {
  let apiKey = localStorage.getItem("open_api_key");
  if (!apiKey) {
    apiKey = await promptForApiKey();
    if (!apiKey) {
      alert(
        "La clé API n'est pas fournie. Certaines fonctionnalités du site peuvent ne pas être disponibles."
      );
    }
  }
}
async function promptForApiKey() {
  const apiKey = prompt("Veuillez saisir votre clé API OpenAI :");
  if (apiKey) {
    localStorage.setItem("open_api_key", apiKey);
  }
  return apiKey;
}

function getZodiacSign(day, month) {
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
    return "Le Verseau";
  } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
    return "Les Poissons";
  } else if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
    return "Le Bélier";
  } else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
    return "Le Taureau";
  } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
    return "Les Gémeaux";
  } else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) {
    return "Le Cancer";
  } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
    return "Le Lion";
  } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
    return "La Vierge";
  } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
    return "La Balance";
  } else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
    return "Le Scorpion";
  } else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
    return "Le Sagittaire";
  } else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) {
    return "Le Capricorne";
  }
}

function getRandomElement(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
function updateZodiacSign() {
  usersZodiac = getZodiacSign(DAY_SELECTOR.value, MONTH_SELECTOR.value);
  updateRequest();
}

function updateRequest() {
  if (usersZodiac.length > 5) {
    request = `Votre signe astrologique est ${usersZodiac}. `;
  }
  if (period.length > 0 && aspect.length > 0) {
    request = `${request} Vous recevez une prédiction pour ${period} concernant votre ${aspect}.`;
  }
  P_REQUEST.innerText = request;
  if (usersZodiac && period && aspect) {
    SUBMIT_BUTTON.disabled = false;
  }
}

function populateDays(month) {
  DAY_SELECTOR.innerHTML = '<option value="">--Jour--</option>';
  let days = 31;
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    days = 30;
  } else if (month === 2) {
    days = 28;
  }
  for (let day = 1; day <= days; day++) {
    const option = document.createElement("option");
    option.value = day;
    option.textContent = day;
    DAY_SELECTOR.appendChild(option);
  }
}

function updateRequestToApi() {
  let style = getRandomElement(STYLES);
  requestToApi = `
  Faites une prédiction fictive comme un horoscope tiré d'un journal. 
  La prédiction doit être écrite dans le style de ${style}. 
  La prédiction doit être faite pour le signe du zodiaque ${usersZodiac}. 
  La prédiction doit tenir compte des caractéristiques typiques de ce signe du zodiaque. 
  Faire des prévisions pour ${period}. Elle doit être en rapport avec le sujet ${aspect}. 
  Jusqu'à 1 000 caractères. Ne mentionnez pas qu'il s'agit d'une prédiction fictive, ne mentionnez pas ${style}. 
  Donnez simplement la prédiction (elle doit être prête à être imprimée dans le journal). 
  Réponse en russe.
  `;
  //console.log(requestToApi);
}

//BUTTTON status
function startLoading() {
  SUBMIT_BUTTON.disabled = true;
  const spanElement = SUBMIT_BUTTON.querySelector("span");
  if (spanElement) {
    spanElement.textContent = "";
    spanElement.classList.add("button-loading");
  }
  const responseElement = document.querySelector(".response-loading");
  if (responseElement) {
    responseElement.classList.add("fast-animation");
  }
}
function stopLoading() {
  SUBMIT_BUTTON.disabled = false;
  const spanElement = SUBMIT_BUTTON.querySelector("span");
  if (spanElement) {
    spanElement.textContent = "Obtenir une réponse";
    spanElement.classList.remove("button-loading");
  }
  const responseElement = document.getElementById("response");
  if (responseElement) {
    responseElement.classList.remove("response-loading");
  }
}

//REQUEST – RESPONSE
async function getPredictionFromOpenAI() {
  open_api_key = localStorage.getItem("open_api_key");
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${open_api_key}`,
  };
  const body = JSON.stringify({
    // model: "gpt-3.5-turbo",
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Vous êtes une diseuse de bonne aventure, une voyante qui peut prédire l'avenir en se basant sur la position des étoiles. Votre dynastie a toujours excellé dans ce domaine. ",
      },
      {
        role: "user",
        content: requestToApi,
      },
    ],
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });
    const data = await response.json();
    console.log(data);
    P_RESPONSE.innerText = data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching prediction from OpenAI:", error);
  }
}
// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  SUBMIT_BUTTON.disabled = true;
  initializeApiKey();

  MONTH_SELECTOR.addEventListener("change", () => {
    const month = parseInt(MONTH_SELECTOR.value);
    populateDays(month);
  });

  DAY_SELECTOR.addEventListener("change", updateZodiacSign);

  PERIOD_SELECTOR.addEventListener("change", () => {
    period = PERIOD_SELECTOR.value;
    updateRequest();
  });

  ASPECT_SELECTOR.addEventListener("change", () => {
    aspect = ASPECT_SELECTOR.value;
    updateRequest();
  });

  SUBMIT_BUTTON.addEventListener("click", async function (event) {
    event.preventDefault();
    startLoading();
    updateRequestToApi();
    await getPredictionFromOpenAI();
    stopLoading();
  });
});
