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
// $heroPage.remove()
const $gamemodesPage = $(`#gamemodes-page`)
// $gamemodesPage.remove()
const $mapsPage = $(`#maps-page`)
// $mapsPage.remove()
const $infoPage = $(`.info-page`)
// $infoPage.remove()
const $sectionTitle = $(`.section-title`)
const $sectionTitleDiv = $(`#section-title-div`)
const $infoSpread = $(`.info-spread`)
const noVideo = [`zarya`, `pharah`, `reaper`, `symmetra`, `torbjorn`, `tracer`, `lucio`, `mercy`]


// functions

// const pageClear = ()=>{
//     $header.addClass(`hidden`)
//     divsArray.forEach((div)=>{
//         $(div).removeClass(`show`)
//         setTimeout(()=>{
//             $(div).remove()
//             $header.remove()
//         },500)
//     })
// }

// const contentClear = ()=>{
//     $(`.section-spread`).addClass(`hidden`)
//     setTimeout(()=>{
//         $(`.section-spread`).remove()
//     },500)
// }

// const pageAdd = (page)=>{
//     $(page).appendTo($body)
//     $(page).addClass(`hidden`)
//     setTimeout(()=>{
//         $(page).addClass(`show`)
//     },500)
// }


// Get list of Heroes on Page 1

const heroesGet = async()=>{
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/heroes`)
    console.log(apiGet)
    return apiGet
}

// Get list of heroes on page 2

const heroGet = async(hero)=>{
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/heroes/${hero}`)
    console.log(apiGet.data)
    return apiGet.data
}

function extractVideoIdFromLink(link) {
    const match = link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/);
    return match ? match[1] : '';
  }



const imgAdd = async(link, key, className) =>{
    const $img = $(`<img>`)  
    $img.attr(`src`, `${link}`)
    $img.attr(`class`, `section-img`)
    $img.on('click', async()=>{
        console.log(`hi`)
        const heroInfo = await heroGet(key)
        $heroPage.addClass(`hide`)
        $(`info-page`).addClass(`hide`)
        infoSetHero(key)
        $(`.section-title`).html(heroInfo.name)
        $(`.info-img`).attr(`src`,heroInfo.portrait)
        $(`.info-img`).attr(`class`, `info-img ${className}`)
        $(`#desc`).html(`Description: ${heroInfo.description}`)
        $(`#location`).html(`Location: ${heroInfo.location}`)
        $(`#role`).html(`Role: ${heroInfo.role}`)
        $infoPage.removeClass(`hide`)
        
    })
    $(`.section-spread`).append($img)
}

const $infoBack = $(`.info-back`)

$infoBack.on(`click`,()=>{
    $infoPage.addClass(`hide`)
    $heroPage.removeClass(`hide`)
    $(`iframe`).contentWindow.postMessage(JSON.stringify({ event: 'command', 
    func: 'stopVideo' }))
    videoStopper($heroVideo)
})



  






const infoSetHero = async(key)=>{
    const getApi = await heroGet(key)
    const $abilityDiv = $(`#ability-div`)
    const $storyDiv = $(`#story-div`)
    for (let i of getApi.abilities){
        console.log(i.name)
        const $abilityContainer = $(`<div>`)
        const $abilityName = $(`<h4 class="ability-name">`)
        const $abilityImg = $(`<img>`)
        const $abilityDesc = $(`<h4>`)

        const $abilityVideo = $('<video />', {
            id: 'video',
            src: i.video.link.mp4,
            type: 'video/mp4',
            controls: false,
            loop: true,
            autoplay: true,
        })

        $abilityContainer.attr(`class`, `ability-container`)
        $abilityName.html(i.name)
        $abilityImg.attr(`src`, i.icon)
        $abilityDesc.addClass(`ability-desc`)
        $abilityDesc.html(i.description)
        $abilityContainer.append($abilityName)
        $abilityContainer.append($abilityImg)
        $abilityContainer.append($abilityDesc)
        $abilityContainer.append($abilityVideo)
        $abilityDiv.append($abilityContainer)
    }

    const $summary = $(`.summary`)
    $summary.html(getApi.story.summary)

    let found = false
    for (let i of noVideo){
        console.log(i)
        console.log(key)
        if (i==key){
            found = true
            break
        }
    }
    
    if (found == false){
        const link = getApi.story.media.link
        console.log(link)
        console.log(link.substring(17))
        console.log(extractVideoIdFromLink(link))
        console.log(link.substring(link-11))
        const idVideo = extractVideoIdFromLink(link)
    
        const $heroVideo = $('<div />', {
            id: 'player'
          }).appendTo('#story-div');
          
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          
          window.onYouTubeIframeAPIReady = function() {
            new YT.Player('player', {
              videoId: idVideo, 
              playerVars: {
                autoplay: 1,
                controls: 1,
                loop: 1,
                playlist: idVideo 
              }
            });
          };

          
    }

    for (let j of getApi.story.chapters){
        const $chapterContainer = $(`<div class="chapter-container">`)
        const $chapterTitle = $(`<h3 class="chapter-title">`)
        const $chapterImg = $(`<img class="chapter-img">`)
        const $chapterDesc = $(`<h4 class="chapter-desc">`)
        $chapterTitle.html(j.title)
        $chapterImg.attr(`src`, j.picture)
        $chapterDesc.html(j.content)
        $chapterContainer.append($chapterTitle)
        $chapterContainer.append($chapterImg)
        $chapterContainer.append($chapterDesc)
        $storyDiv.append($chapterContainer)
    }
}

// event listeners

for (let i of $heroImg){ 
    $(i).on(`click`, async()=>{
        setTimeout(()=>{
            $(`#hero-div`).addClass(`hide`)
            $(`#gamemode-div`).addClass(`hide`)
            $(`#map-div`).addClass(`hide`)
        },0)
        $heroPage.removeClass(`hide`)
        const heroesApi = await heroesGet()
        const heroesData = heroesApi.data
        console.log(heroesData)
        const $backButton = $(`<button>`)
        $backButton.html(`Back`)
        $heroPage.append($backButton)
        $backButton.on(`click`, ()=>{
            $(`#hero-div`).removeClass(`hide`)
            $(`#gamemode-div`).removeClass(`hide`)
            $(`#map-div`).removeClass(`hide`)
        })
        if ($(i).attr(`id`) == `rein`){
            $(`#hero-section-title`).html(`Tank`)
            for (let j of heroesData){
                j.role == `tank` ? imgAdd(j.portrait, j.key, `hero`) : null
            }
            $(`.section-spread`).attr(`id`, `section-spread-tank`)
        } else if ($(i).attr(`id`) == `genji`){
            $(`#hero-section-title`).html(`Damage`)
            for (let j of heroesData){
                j.role == `damage` ? imgAdd(j.portrait, j.key, `hero`) : null
            }
        } else if ($(i).attr(`id`) == `mercy`){
            $(`#hero-section-title`).html(`Support`)
            for (let j of heroesData){
                j.role == `support` ? imgAdd(j.portrait, j.key, `hero`) : null
            }
        }
    })
}

for (let i of $gamemodeImg){
    $(i).on(`click`, ()=>{
    pageAdd($gamemodesPage)
    })
}

for (let i of $mapImg){
    $(i).on(`click`, ()=>{
    pageAdd($mapsPage)
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
