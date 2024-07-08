const useAPI = async (url, fetchData) => {

  const customApi = await fetch(url, fetchData);

  return {
    customApi
  }
}

export default useAPI;