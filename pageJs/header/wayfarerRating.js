function WayfarerRating() {
        var request = new XMLHttpRequest();
        request.addEventListener("load", function(evt){
            if (request.status == 200) {
                console.log('Profile loaded!')
                var rating = document.createElement('section');
                rating.innerText = request.response.body.getElementsByClassName('rating-bar__segment--active')[0].innerText;
                rating.className = 'rating-bar__segment rating-bar__segment--active'
                rating.style = 'border-radius:20px 20px 20px 20px; text-transform:capitalize; margin-right:10px;'
                rating.title = request.response.body.getElementsByClassName('rating-bar__segment--active')[0].getAttribute('uib-tooltip')
                var profilepic = document.getElementsByClassName('inner-container')[1].children[0]
                document.body.children[0].children[2].insertBefore(rating,profilepic)
            }
            else{
                console.log("Couldn't load profile!")
            }
        }, false);

        request.open('GET', 'profile', true)
        request.responseType = "document"
        request.send();
    }
WayfarerRating();
