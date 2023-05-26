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
const $gamemodesPage = $(`#gamemodes-page`)
const $mapsPage = $(`#maps-page`)
const $infoPage = $(`.info-page`)
const $sectionTitle = $(`.section-title`)
const $sectionTitleDiv = $(`#section-title-div`)
const $infoSpread = $(`.info-spread`)
const noVideo = [`zarya`, `pharah`, `reaper`, `symmetra`, `torbjorn`, `tracer`, `lucio`, `mercy`]


// functions

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

// Get list of maps 

const getMaps = async()=>{
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/maps`)
    apiData = apiGet.data
    return apiData
}

// Get list of gamemodes

const getGamemodes = async()=>{
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/gamemodes`)
    apiData = apiGet.data
    return apiData
}


// Stats Page

const playerGet = async(playerName)=>{
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/players/${playerName}`)
    apiData = apiGet.data
    console.log(apiData)
    return apiData 
}

const $searchButton = $(`#player-search-button`)

$searchButton.on(`click`, async()=>{
    
    $(`.rank-roles`) ? $(`.rank-roles`).empty() : null
    $(`#endorsement-img`) ? $(`#endorsement-img`).remove() : null
    $(`.pc-div`) ? $(`.pc-div`).remove() : null
    let $input = $(`input`)
    let inputVal = $input.val()
    let replacedVal = inputVal.replace("#", "-")
    const playerInfo = await playerGet(replacedVal)
    $(`.player-banner`).attr(`src`, playerInfo.summary.namecard)
    $(`#username`).html(`Username: ${playerInfo.summary.username}`)
    $(`.player-icon`).attr(`src`, playerInfo.summary.avatar)
    $(`.player-title`).html(`Title: ${playerInfo.summary.title}`)
    $(`.endorsement-level`).html(`Endorsement Level: `)

    const $endorsementImg = $(`<img id="endorsement-img">`)
    $endorsementImg.attr(`src`, playerInfo.summary.endorsement.frame)
    $(`.endorsement`).append($endorsementImg)
    const pc = playerInfo.summary.competitive.pc

    if(playerInfo.summary.competitive.pc != null){
        const $systemDiv = $(`<div class="pc-div">`)
        const $pcTitle = $(`<h2 class="pc-title">`)
        $pcTitle.html(`PC`)
        const $rankRoles = $(`<div class="rank-roles">`)
        const $tankRoleDiv = $(`<div class="tank role-rank-div">`)
        const $tankRoleTitle = $(`<h2 class="role-title">Tank</h2>`)
        $tankRoleDiv.append($tankRoleTitle)
        $rankRoles.append($tankRoleDiv)
        
        const $damageRoleDiv = $(`<div class="damage role-rank-div">`)
        const $damageRoleTitle = $(`<h2 class="role-title">Damage</h2>`)
        $damageRoleDiv.append($damageRoleTitle)
        $rankRoles.append($damageRoleDiv)

        const $supportRoleDiv = $(`<div class="support role-rank-div">`)
        const $supportRoleTitle = $(`<h2 class="role-title">Support</h2>`)
        $supportRoleDiv.append($supportRoleTitle)
        $rankRoles.append($supportRoleDiv)
        
        if (playerInfo.summary.competitive.pc.tank){
            const $rankImg = $(`<img>`)
            $rankImg.attr(`src`, playerInfo.summary.competitive.pc.tank.rank_icon)
            $tankRoleDiv.append($rankImg)
            const $rank = $(`<h2 class="rank">`)
            $rank.html(`${playerInfo.summary.competitive.pc.tank.division} ${playerInfo.summary.competitive.pc.tank.tier}`)
            $tankRoleDiv.append($rank)
        
        }
        if (playerInfo.summary.competitive.pc.damage){
            const $rankImg = $(`<img>`)
            $rankImg.attr(`src`,playerInfo.summary.competitive.pc.damage.rank_icon)
            $damageRoleDiv.append($rankImg)
            const $rank = $(`<h2 class="rank">`)
            $rank.html(`${playerInfo.summary.competitive.pc.damage.division} ${playerInfo.summary.competitive.pc.damage.tier}`)
            $damageRoleDiv.append($rank)
        }

        if (playerInfo.summary.competitive.pc.support){
            const $rankImg = $(`<img>`)
            $rankImg.attr(`src`, playerInfo.summary.competitive.pc.support.rank_icon)
            $supportRoleDiv.append($rankImg)
            const $rank = $(`<h2 class="rank">`)
            $rank.html(`${playerInfo.summary.competitive.pc.support.division} ${playerInfo.summary.competitive.pc.support.tier}`)
            $supportRoleDiv.append($rank)
        }

        $systemDiv.append($pcTitle)
        $systemDiv.append($rankRoles)
        $(`.systems`).append($systemDiv)
    }
    
      
})

// Youtube Link Function

function extractVideoIdFromLink(link) {
    const match = link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/);
    return match ? match[1] : '';
}

// Add images to page 2 with each image acting as a button to link to the hero information page

const imgAdd = async(link, key, className) =>{
    const $img = $(`<img>`)  
    $img.attr(`src`, `${link}`)
    $img.attr(`class`, `section-img`)
    $img.on('click', async()=>{
        console.log(`hi`)
        const heroInfo = await heroGet(key)
        // $heroPage.addClass(`hide`)
        pageHide($heroPage)
        $(`info-page`).addClass(`hide`)
        infoSetHero(key)
        $(`.info-img`).attr(`src`,heroInfo.portrait)
        $(`.info-img`).attr(`class`, `info-img ${className}`)
        $(`#desc`).html(`Description: ${heroInfo.description}`)
        $(`#location`).html(`Location: ${heroInfo.location}`)
        $(`#role`).html(`Role: ${heroInfo.role}`)
        $infoPage.removeClass(`hide`)
        
    })
    $(`.section-spread`).append($img)
}

// hides a page and applies css animation to it

const pageHide = (page)=>{
    $(page).removeClass(`show`)
    setTimeout(()=>{
        $(page).addClass(`hide`)
    },500)
    
}


const $backButton = $(`<button>`)
$backButton.html(`Back`)
$(`#section-title-div`).append($backButton)

$backButton.on(`click`, ()=>{
    pageHide($(`#heroes-page`))
    setTimeout(()=>{
        $(`.section-img`).remove()
        $header.removeClass(`hide`)
        $header.addClass(`show`)
        $(`.home-page`).removeClass(`hide`)
    },500)
    
    
})

const $infoBack = $(`.info-back`)

$infoBack.on(`click`,()=>{
    pageHide($infoPage)
    setTimeout(()=>{
        $heroPage.removeClass(`hide`)
        $(`.ability-container`).remove()
        $(`.chapter-container`).remove()
    })
    $(`#player`).remove()
})

const $mapBack = $(`.maps-back`)

$mapBack.on(`click`, ()=>{
    pageHide($mapsPage)
    setTimeout(()=>{
        $header.removeClass(`hide`)
        $header.addClass(`show`)
        $(`.home-page`).removeClass(`hide`)
    },500)
})



// code for populating different hero pages based on image clicked on home page

for (let i of $heroImg){ 
    $(i).on(`click`, async()=>{
        setTimeout(()=>{
            pageHide(`.home-page`)
            $header.addClass(`hidden`)
            pageHide(`header`)
        },0)
        $heroPage.removeClass(`hide`)
        const heroesApi = await heroesGet()
        const heroesData = heroesApi.data
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

// Function to populate hero information page with information about hero, including images, videos, and a youtube video

const infoSetHero = async(key)=>{
    const getApi = await heroGet(key)
    const $abilityDiv = $(`#ability-div`)
    const $storyDiv = $(`#story-div`)
    $(`#hero-name`).html(getApi.name)
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
          
        if (typeof YT !== 'undefined' && YT.loaded) {
            createYouTubePlayer(idVideo);
          } else {
            window.onYouTubeIframeAPIReady = () => {
              createYouTubePlayer(idVideo);
            };
          } 
    }

    function createYouTubePlayer(videoId) {
        new YT.Player('player', {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            loop: 1,
            playlist: videoId,
          },
        });
      }

    for (let j of getApi.story.chapters){
        const $chapterContainer = $(`<div class="chapter-container">`)
        const $chapterTitle = $(`<h3 class="chapter-title">`)
        const $chapterImg = $(`<img class="chapter-img">`)
        const $chapterDesc = $(`<h4 class="chapter-desc">`)
        const $chapterImgDesc = $(`<div class="chapter-img-desc">`)
        $('.chapter-img-desc:nth-child(even)').addClass('reverse')
        const words = j.title.split(' ') 
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
        const capitalizedTitle = capitalizedWords.join(' ')
        $chapterTitle.html(capitalizedTitle)
        $chapterImg.attr(`src`, j.picture)
        $chapterDesc.html(j.content)
        $chapterContainer.append($chapterTitle)
        $chapterImgDesc.append($chapterImg)
        $chapterImgDesc.append($chapterDesc)
        // $chapterContainer.append($chapterImg)
        // $chapterContainer.append($chapterDesc)
        $chapterContainer.append($chapterImgDesc)
        $storyDiv.append($chapterContainer)
    }
}



for (let i of $gamemodeImg){
    $(i).on(`click`, async()=>{
        pageHide(`.home-page`)
        $gamemodesPage.removeClass(`hide`)
        const gamemodesList = await getGamemodes()
        console.log(gamemodesList)
        for (let i of gamemodesList){
            const $gmDiv = $(`<div>`)
            const $img = $(`<img>`)
            const $gmName = $(`<h4 class="gm-name">`)
            const $gmDesc = $(`<h4 class="gm-desc">`)
            $gmName.html(i.name)
            $gmDesc.html(i.description)
            $gmDiv.attr(`class`, `gm-div`)
            $img.attr(`src`,i.screenshot)
            $img.attr(`class`, `gm-img`)
            $gmName.appendTo($gmDiv)
            $img.appendTo($gmDiv)
            $gmDesc.appendTo($gmDiv)
            $gmDiv.appendTo(`#gamemodes-section-spread`)
        }

    })
}

for (let i of $mapImg){
    $(i).on(`click`, async()=>{
        pageHide(`.home-page`)
        $mapsPage.removeClass(`hide`)
        const mapList = await getMaps()
        console.log(mapList)
        for(let i of mapList){
            const $mapInfoDiv = $(`<div class="map-info-div">`)
            const $img = $(`<img>`)
            const $mapTitle = $(`<h4 class="map-title">`)
            const $mapLoc = $(`<h4 class="map-location">`)
            $mapTitle.html(i.name)
            $img.attr(`src`,i.screenshot)
            $mapLoc.html(i.location)
            $mapTitle.appendTo($mapInfoDiv)
            $img.appendTo($mapInfoDiv)
            $mapLoc.appendTo($mapInfoDiv)
            $mapInfoDiv.appendTo(`#maps-section-spread`)
        }
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


$(document).ready(function() {
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      var opacity = 1 - scroll / 8000 
  
      $(".background").css("opacity", opacity)
  
      if (scroll > 0) {
        $(".background").addClass("dark")
      } else {
        $(".background").removeClass("dark")
      }
    })
  })
  