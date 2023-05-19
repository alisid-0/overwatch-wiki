const observer = new IntersectionObserver((i)=>{
    i.forEach((j) =>{
        console.log(j)
        if (j.isIntersecting){
            j.target.classList.add(`show`)
        } else {
            j.target.classList.remove(`show`)
        }
    })
})


const hiddenElements = document.querySelectorAll(`.hidden`)
hiddenElements.forEach((i)=> observer.observe(i))




const $buttonHeroes = $(`#heroes-button`)
const $input = $(`#hero-search`)
const $inputButton = $(`#hero-search-button`)
const $heroDetails = $(`#hero-details`)


$buttonHeroes.on(`click`, async()=>{
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/heroes`)
    console.log(apiGet)
})

$inputButton.on(`click`, async ()=>{
    const $inputVal = $input.val()
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/heroes/${$input.val()}`)
    $heroDetails.html(`${apiGet.data.description}`)
    console.log(apiGet)
})
