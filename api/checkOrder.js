const Airtable = require('airtable');

exports.handler = async (event) => {
  const { email, orderId } = JSON.parse(event.body);

  const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base('appwRHQBdtpcyhjNd');

  try {
    const records = await base('Orders').select({
      filterByFormula: `AND({Email} = '${email}', {OrderID} = '${orderId}')`
    }).firstPage();

    if (records.length > 0) {
      const pageURL = records[0].get('PageURL');
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: true, pageURL })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
