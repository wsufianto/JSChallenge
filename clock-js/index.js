/* Retrieve the dom for second, minute & hour */
const secondHand = document.querySelector('.seconds');
const minuteHand = document.querySelector('.minutes');
const hourHand = document.querySelector('.hours');

/* set the time (hour, minute, second) for the clock */
const setDate = () => {
    // get a new date instance
    const now = new Date();

    // get the second from the date instance & set it to DOM
    const second = now.getSeconds();
    const secondDegree = ((second / 60) * 360) + 90;
    secondHand.style.transform = `rotate(${secondDegree}deg)`;

    // get the minute from the date instance & set it to DOM
    const minute = now.getMinutes();
    const minuteDegree = ((minute / 60) * 360) + 90;
    minuteHand.style.transform = `rotate(${minuteDegree}deg)`;

    // get the hour from the date instance & set it to DOM
    const hour = now.getHours();
    const hourDegree = ((hour / 12) * 360) + 90;

    const houradjust = Math.floor(minute / 10) * 6;

    hourHand.style.transform = `rotate(${hourDegree + houradjust}deg)`;
};

// Run the setDate function every 1 second
setInterval(setDate, 1000);
