import React, {createContext, useState} from "react";

const Context = createContext();

function ContextProvider(props){
    const [input, setInput] = useState({
        Month: 1,
        Day: 1,
        Year: 2000
    });

    const [example, setExample] = useState({
        anchorYearExample: 1,
        anchorDayYearExample: 1,
        doomsDayMonthExample: 1,
        doomsDayDayExample: 1,
        doomsDayYearExample: 1,
        dotwDayExample: 1,
        dotwMonthExample: 1,
        dotwYearExample: 1
    });

    const [maxDays, setMaxDays] = useState(31);
    const [leapYear, setLeapYear] = useState(true);
    const [doomsDay, setDoomsDay] = useState(2);
    const [closestDoomsDay, setClosestDoomsDay] = useState([4, 29, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12]);
    //DoomsDays per month: (1/3 or 1/4 on LY), (2/28 or 2/29 on LY), (3/14 Pie Day), 4/4, 6/6, 8/8, 10/10, 12/12, 9/5, 5/9, 7/11, 11/7

    const [toggle, setToggle] = useState({
        anchor: false,
        anchorDay: false,
        findDoomsDay: false,
        dayOfTheWeek: false
    });


    console.log(example);
    function handleToggle(e){
        const id = e.target.name;
        setToggle((prevToggle) =>{
            return {
                ...prevToggle,
                [id]: !prevToggle[id]
            };
        });
    };

    console.log(toggle);
    function handleChange(e){ //When user inputs date
        e.preventDefault();
        const userInput = parseInt(e.target.value); //Since the user input will be a string we change it to an int
        changeInput(userInput, e.target.name);
        
    };

    function changeInput(userValue, inputChange){ //This is where we determine what value to change
        if(userValue <= 0){
            switch(inputChange){ //Only deals with examples
                case "anchorYearExample":
                case "anchorDayYearExample":
                case "doomsdayMonthExample":
                case "doomsdayDayExample":
                case "doomsdayYearExample":
                case "dotwMonthExample":
                case "dotwDayExample":
                case "dotwYearExample":
                    tooLowCheck(inputChange);
                    return;
                

                default:
                    tooLowCheck(inputChange);
                    changeMaxDays(1); //If we don't change the max days then the user can e.g. 999 as the Day
                    return; //We want to stop the rest of the function since it'll override the work zeroOrLowerCheck func
            };
        };

        switch(inputChange){ //Validate the user input, change maxDays, check for leap year
            case "Month":
                changeMaxDays(userValue, leapYear);
                if(userValue > 12){ //When user inputs 12 or higher
                    tooHighCheck(inputChange);
                    return;
                }
                break;

            case "Day":
                if(userValue > maxDays){ //When user inputs an amount of day more than the month has
                    tooHighCheck(inputChange, userValue);
                    return;  
                } 
                break;
            
            case "Year":
                setDoomsDay(2);
                if(userValue % 4 === 0){
                    setLeapYear(true);
                    changeMaxDays(input.Month, true);
                    /*Cant find a workaround for setting the leap year, waiting 
                    for the change, then using that new leap year value
                    that's why I hard coded true and false bools, this kinda defeats the 
                    purpose of state execpt for line 46*/
                } else{
                    setLeapYear(false);
                    changeMaxDays(input.Month, false);
                }
                changeAnchorDay(userValue);
                break;

            default:
                break;
        };

        if(leapYear === true){
            setClosestDoomsDay([4, 29, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12]);
        } else{
            setClosestDoomsDay([3, 28, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12]);
        }

        switch(inputChange){ //Deals with examples
            case "anchorYearExample":
                case "anchorDayYearExample":
                case "doomsdayMonthExample":
                case "doomsdayDayExample":
                case "doomsdayYearExample":
                case "dotwMonthExample":
                case "dotwDayExample":
                case "dotwYearExample":
                setExample((prevExample) =>{
                    return {
                        ...prevExample,
                        [inputChange] : userValue
                    };
                });
                return;

            default:
                break;
        };
        
        setInput((prevInput) =>{ //The actual change
            return {
                ...prevInput,
                [inputChange]: userValue
            };
        });
    };

    function changeMaxDays(month, leapYearBool = false){ //Each month has a different amount of days it can have
        setMaxDays(() =>{
            switch(month){
                case 1:
                case 3:
                case 7:
                case 8:
                case 10:
                case 12:
                    tooHighCheck("Day", input.Day, 31);
                    return 31;
                
                case 4:
                case 5:
                case 6:
                case 9:
                case 11:
                    tooHighCheck("Day", input.Day, 30);
                    return 30;

                case 2: //Feb can be 28 or 29 if it's a leap year
                    if(leapYearBool){ 
                        tooHighCheck("Day", input.Day, 29);
                        return 29;
                    } else{
                        tooHighCheck("Day", input.Day, 28);
                        return 28;
                    };
            };
        });
    };

    function tooLowCheck(inputChange){// Used when user inputs date equal or lower than 0
        setInput((prevInput) =>{
            return {
                ...prevInput,
                [inputChange]: 1
            };
        });
    };

    function tooHighCheck(inputChange, userInput, mxm = maxDays){// Checks if input is too high
        if(inputChange === "Month"){
            setInput((prevInput) =>{
                return {
                    ...prevInput,
                    Month: 12
                };
            });
        } else if(inputChange === "Day" && userInput > mxm){
            /*Used when user input invalid day, f.g. user inputs 31 days 
            for the month of april when there can only be 30 max days*/
            setInput((prevInput) =>{
                return {
                    ...prevInput,
                    Day: mxm
                };
            });
        };
    };

    function findDate(){
        const doomsDayMatch = closestDoomsDay[input.Month - 1]; //-1 adjusts for the array starting at index 0
        let dayDiff = input.Day - doomsDayMatch;
        
        if(dayDiff >= 7 || dayDiff <= -7){ //Remove multiples of 7
            dayDiff = dayDiff % 7;
        };

        const preAdjustDay = doomsDay + dayDiff; //Determines the next step

        if(preAdjustDay > 6){ //For dates past doomsDayMatch
            return preAdjustDay - 7;

        } else if(preAdjustDay < 0){ //For dates before doomsDayMatch
            return preAdjustDay + 7;

        } else{ //For dates the same week as doomsDayMatch
            return preAdjustDay;
        };

    };

    function changeAnchorDay(Year){
        let yearDiff = Year - 2000; //2000 is the baseline year and the yearDiff determines how many days to add
        let leapYearsAmount, leapYears, normalYears, totalDays, preAdjustDay;
        console.log("yearDiff" + yearDiff);

        if(yearDiff <= 0){ //User inputs year below 2000
            yearDiff = Math.abs(yearDiff); //Year diff must be positive

            setDoomsDay((prevDD) =>{
                leapYearsAmount = Math.floor(yearDiff / 4) + 1; 
                /*The +1 is there to adjust for the leap year, 
                since going from 2000 -> 1999 is going from a leap year to a normal year*/

                if(Year === 1996){ //After/during the year 1996 take away extra leap year
                    leapYearsAmount--;
                }

                leapYears = leapYearsAmount * 2;
                normalYears = yearDiff - leapYearsAmount;
                totalDays = (leapYears + normalYears) % 7;
                preAdjustDay = prevDD - totalDays;

                console.log("leapYearsAmount:" + leapYearsAmount);
                console.log("leapYears:" + leapYears);
                console.log("normalYears:" + normalYears);
                console.log("totalDays:" + totalDays);
                console.log("preAdjustDay:" + preAdjustDay);

                //[0,1,2,3,4,5,6]
                if(preAdjustDay < 0){ //Adding 7 represents a cycle
                    return preAdjustDay + 7;
                } else{
                    return preAdjustDay;
                };
            });
            return;
        };

        setDoomsDay((prevDD) =>{
            leapYearsAmount = Math.floor(yearDiff / 4);

            leapYears = leapYearsAmount * 2; 
            //Leap years cause doomsday to jump two places hence the two e.g. 1999 DD: Sun 2000 DD: Tue

            normalYears = yearDiff;
            //The rest of the normal years are calculated

            totalDays = (normalYears + leapYears) % 7; 
            //7 days will be one full rotation so we really only care about the remainder 

            /*[0,1,2,3,4,5,6]
            Num returned determines element of Array, 
            each num represents a day of the week e.g. 0 = sun, 1 = mon, etc.*/
            preAdjustDay = prevDD + totalDays;

            console.log("leapYearAmount:" + leapYearsAmount);
            console.log("LeapYears:" + leapYears);
            console.log("totalDays:" + totalDays);

            if(preAdjustDay >= 7){
                return preAdjustDay - 7; 
                /*We sub by 7 in order to represent a "loop" 
                E.g. 2 + 5 = 7, 7 doesn't exist in array, 7 - 7 = 0 which does exist*/
            } else{
                return preAdjustDay;
            };
            
        });
    };

    console.log(doomsDay);

    return(
        <Context.Provider value={{
            input, 
            setInput, 
            maxDays, 
            changeMaxDays,
            leapYear,
            setLeapYear,
            handleChange,
            findDate,
            toggle,
            handleToggle,
            }}>
            {props.children}
        </Context.Provider>
    );
};

export {ContextProvider, Context};