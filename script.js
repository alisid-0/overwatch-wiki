// global variables

const $header = $(`header`)
const $body = $(`body`)

const $heroDiv = $(`#hero-div`)
const $gamemodeDiv = $(`#gamemode-div`)
const $mapDiv = $(`#map-div`)

const divsArray = [$heroDiv, $gamemodeDiv, $mapDiv]

const $heroImg = $(`.hero-img`)
const $gamemodeImg = $(`.gamemode-img`)
const $mapImg = $(`.map-img`)

const imgArray =[$heroImg, $gamemodeImg, $mapImg]

for (let i of imgArray){
    $(i).on(`click`, ()=>{
    $header.addClass(`hidden`)
    divsArray.forEach((div)=>{
        $(div).removeClass(`show`)
        setTimeout(()=>{
            $(div).remove()
            $header.remove()
        },500)
    })
    })
}

// animation section
const observer = new IntersectionObserver((i)=>{
    i.forEach((j) =>{
        if (j.isIntersecting){
            j.target.classList.add(`show`)
        } else {
            j.target.classList.remove(`show`)
        }
    })
})




const hiddenElements = document.querySelectorAll(`.hidden`)
hiddenElements.forEach((i)=> observer.observe(i))

const heroesGet = async()=>{
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/heroes`)
    console.log(apiGet)
}

heroesGet()