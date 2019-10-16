let people = [];
let currPerson = {};
let addUserBtn = document.querySelector('#adduser');
let goBackBtn = document.querySelector('#goback');
let tweetBtn;
let commentTextArea;

//1. Using the API(see above), fetch 3 twitter short - profiles such that upon refresh, a random set of three short - profiles is always fetched
async function getPeople(number = 3) {
    res = await fetch(`https://randomuser.me/api/?results=${number}`);
    data = await res.json();
    //people.push(...data.results);
    return data.results;
}

// 2. Display all the people using the short - profile HTML template
displayAll();
async function displayAll() {
    people = await getPeople();
    renderList();
}

const main = document.querySelector('main');

// Render list of people information
function renderList() {
    main.innerHTML = people.map((person, idx) => {
        return `<article class="dt w-100 bb b--black-05 pb2 mt2" data-index="${idx}" href="#0">
      <div class="dtc w2 w3-ns v-mid">
        <img src="${person.picture.large}" class="ba b--black-10 db br-100 w2 w3-ns h2 h3-ns"/>
      </div>
      <div class="dtc v-mid pl3">
        <h1 class="f6 f5-ns fw6 lh-title black mv0">${person.name.first} ${person.name.last}</h1>
        <h2 class="f6 fw4 mt0 mb0 black-60">@${person.login.username}</h2>
      </div>
      <div class="dtc v-mid">
        <form class="w-100 tr">
          <button data-index="${idx}" class="follow f6 button-reset bg-white ba b--black-10 dim pointer pv1 black-60" type="submit">${person.isFollowing ? '- Following' : '+ Follow'}</button>
        </form>
      </div>
    </article>`
    }).join('');
}

// 3. Make the Add User button functional such that it fetches one more person (may use fetch, or async/await/fetch, but not XMLHttpRequest) ...
addUserBtn.addEventListener('click', add1User);
async function add1User(e) {
    e.preventDefault();
    let person = await getPeople(1);
    if (person) {
        people.push(person[0]);
        // 4 ...then displays that additional person to the end of the short-profiles list
        renderList();
    }
}

// 5. If user clicks one of the short-profiles, the long-profile (see above) for that clicked-person displays instead along with a textarea box and a Tweet button
main.addEventListener('click', mainClicked);
function mainClicked(e) {
    if (e.target.closest('article')) {
        gotoProfile(e.target.closest('article'));
    }
}

function gotoProfile(e) {
    if (e.dataset.index) {
        // 10. Make the Go Back button functional such that it appears whenever a long-profile is displayed; upon click, displays the short-profiles list
        addUserBtn.classList.add('dn');
        addUserBtn.classList.remove('dib');
        goBackBtn.classList.remove('dn');
        goBackBtn.classList.add('dib');

        // Display along the long profile with textarea box and a Tweet button
        let index = e.dataset.index;
        currPerson = people[index];
        renderProfile(currPerson);
    }
}

// Render a person information
function renderProfile(person) {
    main.innerHTML = 
         `
            <article>
                <div class="tc">
                    <img src="${person.picture.large}" class="br-100 h3 w3 dib" title="" />
                    <h1 class="f4">${person.name.first} ${person.name.last}</h1>
                    <hr class="mw3 bb bw1 b--black-10">
                </div>
                <div class="dtc v-mid pl3">
                    <p class="lh-copy measure center f6 black-70">
                        ${person.email}<br>
                        ${person.cell}<br>
                        ${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state} ${person.location.postcode}, ${person.location.country}
                    </p>
                </div>
                <div class="dtc v-mid pl6">
                    <form class="w-100 tr">
                        <button class="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-dark-blue" type="submit">+ Follow</button>
                    </form>
                </div>

                <form class="pa4 black-80">
                    <div>
                        <textarea id="comment" placeholder="What's happening?" name="comment" class="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2" aria-describedby="comment-desc"></textarea>
                        <a id="tweet" class="f6 link dim br1 ba bw2 ph3 pv2 mb2 dib dark-blue" href="#0">Tweet</a>
                    </div>
                </form>
            </article>`;
    tweetBtn = document.querySelector('#tweet');
    tweetBtn.addEventListener('click', tweet);
    commentTextArea = document.querySelector('#comment');
    renderTweets(person);
}

// 7. If user types something in the textarea boxes and clicks tweet, then display that tweet using the tweets HTML template

function tweet(e) {
    e.preventDefault();
    let tweet = commentTextArea.value;
    if (tweet != '') {
        if (currPerson.tweets == null) {
            currPerson.tweets = [];
        }
        currPerson.tweets.push(tweet);
        renderTweets(currPerson);
    }
}

function renderTweets(person) {
    if (person.tweets) {
        let tweetsHtml = person.tweets.map(tweet => {
            return `
            <div class="dt w-100 bb b--black-05 pb2 mt2" href="#0">
                <div class="dtc w2 w3-ns v-mid">
                    <img src="${person.picture.large}" class="ba b--black-10 db br-100 w2 w3-ns h2 h3-ns"/>
                </div>
                <div class="dtc v-mid pl3">
                    <p>${tweet}</p>
                </div>
            </div>
        `}).join('');
        main.innerHTML += tweetsHtml;
    }
}

//9. If user goes back to short - profiles list, and clicks another person, user can similarly create tweets for that person as well
goBackBtn.addEventListener('click', () => {
    // Display addUser button and hide the goBack button
    addUserBtn.classList.remove('dn');
    addUserBtn.classList.add('dib');
    goBackBtn.classList.add('dn');
    goBackBtn.classList.remove('dib');
    renderList();
});