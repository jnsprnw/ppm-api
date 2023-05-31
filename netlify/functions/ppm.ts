import datum from '../../src/data/co2-ppm-daily_json.json';

function invalidRequest (msg) {
  return {
    statusCode: 400,
    body: JSON.stringify({
      msg
    })
  }
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

const parseObj = ({ date, value }) => ({ date: new Date(date), value: parseFloat(value) });

const data = datum.map(parseObj);

const minDate = data.at(0).date;
const maxDate = data.at(-1).date;

export const handler = async (event) => {
  const dateStr = event?.queryStringParameters?.date;

  if (!dateStr) {
    return invalidRequest('No date string provided');
  }
  
  const inputDate = new Date(dateStr);

  if (!isValidDate(inputDate)) {
    return invalidRequest('Invalid date string');
  }

  if (inputDate < minDate) {
    return invalidRequest(`Date too late. Min date is ${minDate.toISOString().split('T')[0]}.`);
  }

  if (inputDate > maxDate) {
    return invalidRequest(`Date too late. Max date is ${maxDate.toISOString().split('T')[0]}.`);
  }

  let retValue;
  let retDate;
  for (let i = 0; i < data.length; i++) {
    const { date: d } = data[i];
    if (d > inputDate) {
      const el = data[i - 1];
      retValue = el.value;
      retDate = el.date;
      break;
    }
    
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      request: event.queryStringParameters.id,
      requestedDate: inputDate,
      date: retDate,
      value: retValue
    })
  }
}