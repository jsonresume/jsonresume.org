/**
 * Get company data by name
 */
async function getCompanyData(supabase, companyName) {
  const { data: companyData, error } = await supabase
    .from('companies')
    .select()
    .eq('name', companyName);

  if (error) {
    console.error('Error fetching company data:', error);
    return null;
  }

  if (companyData && companyData[0]) {
    const parsedCompanyData = JSON.parse(companyData[0].data);
    return parsedCompanyData.choices[0].message.content;
  }

  return null;
}

module.exports = { getCompanyData };
