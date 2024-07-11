const MONTH_SELECTOR = document.getElementById("birth-month");
const DAY_SELECTOR = document.getElementById("birth-day");
const PERIOD_SELECTOR = document.getElementById("period-selector");
const ASPECT_SELECTOR = document.getElementById("aspect-selector");
const P_REQUEST = document.getElementById("request");
const SUBMIT_BUTTON = document.getElementById("submit-button");

//FOR API
const CLIENT_SECRET = "";
const AUTHORIZATION_DATA = "";

let usersZodiac = "";
let period = "";
let aspect = "";
let request = "";
let requestToApi = "";
let access_token = "";

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
  requestToApi = `Faites une prédiction fictive comme un horoscope tiré d'un journal. La prédiction doit être écrite dans le style de Stephen King. La prédiction doit être faite pour le signe du zodiaque ${usersZodiac}. La prédiction doit tenir compte des caractéristiques typiques de ce signe du zodiaque. Faire des prévisions pour ${period}. Elle doit être en rapport avec le sujet ${aspect}. Jusqu'à 1 000 caractères. Ne mentionnez pas qu'il s'agit d'une prédiction à la blague, ne mentionnez pas Stephen King. Donnez simplement la prédiction (elle doit être prête à être imprimée dans le journal). `;
  //console.log(requestToApi);
}

//REQUEST – RESPONSE
function getAccessToken() {
  let accessToken = "";
  //   const url =
  //     "https://corsproxy.io/?https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
  const url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
  const payload = "scope=GIGACHAT_API_PERS";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    RqUID: CLIENT_SECRET,
    Authorization: `Basic ${AUTHORIZATION_DATA}`,
    "X-Requested-With": "XMLHttpRequest",
  };
  const response = fetch(url, {
    method: "POST",
    headers: headers,
    body: payload,
  });
  //console.log(response.json());
  //   accessToken = response.json();
  //   console.log(accessToken);
  //   return accessToken;
}

document.addEventListener("DOMContentLoaded", () => {
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
    updateRequestToApi();
    await getAccessToken();
  });
});
