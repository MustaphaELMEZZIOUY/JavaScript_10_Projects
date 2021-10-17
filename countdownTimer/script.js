$(document).ready(function(){
    const DOMStrings = {
        days: '#days',
        hours: '#hours',
        mins: '#mins',
        seconds: '#seconds'
    }

    const DOMSelecte = {
        _days : $(DOMStrings.days),
        _hours: $(DOMStrings.hours),
        _mins: $(DOMStrings.mins),
        _seconds: $(DOMStrings.seconds)
    }

    function difference(date1, date2) {  
        const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds());
        const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds());
        const dateLeft = date2utc - date1utc;
        let day = 1000*60*60*24;
        let hour = 1000*60*60;
        let min = 1000*60;
        let second = 1000;
        return {
            days: Math.floor((dateLeft)/day),
            hours: Math.floor(((dateLeft)%day)/hour),
            mins: Math.floor(((dateLeft)%hour)/min),
            seconds: Math.floor(((dateLeft)%min)/second),
        }
    }

    function setTime(timeLeft){
        DOMSelecte._days.text(timeLeft.days);
        DOMSelecte._hours.text(timeLeft.hours);
        DOMSelecte._mins.text(timeLeft.mins);
        DOMSelecte._seconds.text(timeLeft.seconds);
    }
    function updateTime(){
        const nextYear = `${new Date().getFullYear() + 1}-01-01`;
        setTime(difference(new Date(), new Date(nextYear)));
    }

    // to not wait a second before updating the time left
    updateTime();

    // call the updateTime ever second
    setInterval(updateTime, 1000);
})