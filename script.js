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


const $heroPage = $(`#heroes-page`)
$heroPage.remove()

const $gamemodesPage = $(`#gamemodes-page`)
$gamemodesPage.remove()

const $mapsPage = $(`#maps-page`)
$mapsPage.remove()

const $sectionTitle = $(`.section-title`)

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

// functions

const pageClear = ()=>{
    $header.addClass(`hidden`)
    divsArray.forEach((div)=>{
        $(div).removeClass(`show`)
        setTimeout(()=>{
            $(div).remove()
            $header.remove()
        },500)
    })
}

const contentClear = ()=>{
    $(`.section-spread`).addClass(`hidden`)
    setTimeout(()=>{
        $(`.section-spread`).remove()
    },500)
}

const pageAdd = (page)=>{
    $(page).appendTo($body)
    $(page).addClass(`hidden`)
    setTimeout(()=>{
        $(page).addClass(`show`)
    },500)
}

const imgAdd = async(link, key) =>{
    const $img = $(`<img>`)
    $img.attr(`src`, `${link}`)
    $img.attr(`class`, `section-img`)
    $(`.section-spread`).append($img)
    $img.on(`click`, async()=>{
        const heroInfo = await heroGet(key)
        // console.log(heroInfo)
        contentClear()
        $(`.section-title`).html(heroInfo.name)
        $(`.info-img`).attr(`src`,heroInfo.portrait)
        $(`#desc`).html(`Description: ${heroInfo.description}`)
        $(`#location`).html(`Location: ${heroInfo.location}`)
        $(`#role`).html(`Role: ${heroInfo.role}`)
    })
}

// event listeners

for (let i of $heroImg){ 
    $(i).on(`click`, async()=>{
        pageClear()
        pageAdd($heroPage)
        const heroesApi = await heroesGet()
        const heroesData = heroesApi.data
        console.log(heroesData)
        if ($(i).attr(`id`) == `rein`){
            $(`#hero-section-title`).html(`Tank`)
            for (let j of heroesData){
                j.role == `tank` ? imgAdd(j.portrait, j.key) : null
            }
            $(`.section-spread`).attr(`id`, `section-spread-tank`)
        } else if ($(i).attr(`id`) == `genji`){
            $(`#hero-section-title`).html(`Damage`)
            for (let j of heroesData){
                j.role == `damage` ? imgAdd(j.portrait, j.key) : null
            }
        } else if ($(i).attr(`id`) == `mercy`){
            $(`#hero-section-title`).html(`Support`)
            for (let j of heroesData){
                j.role == `support` ? imgAdd(j.portrait, j.key) : null
            }
        }
    })
}



for (let i of $gamemodeImg){
    $(i).on(`click`, ()=>{
    pageClear()
    pageAdd($gamemodesPage)
    })
}

for (let i of $mapImg){
    $(i).on(`click`, ()=>{
    pageClear()
    pageAdd($mapsPage)
    })
}

const heroesGet = async()=>{
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/heroes`)
    console.log(apiGet)
    return apiGet
}

const heroGet = async(hero)=>{
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/heroes/${hero}`)
    console.log(apiGet.data)
    return apiGet.data
}
