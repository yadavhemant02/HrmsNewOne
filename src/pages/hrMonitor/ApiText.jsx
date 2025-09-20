const ApiText = () => {
    const fetchdata = async () => {
        try {
            const response = await axios.get(``);
            setData(response.data.result);
            console.log("data ->", response.data.result)
        } catch(error){
            console.log("fetching error",error);
        }
}
}