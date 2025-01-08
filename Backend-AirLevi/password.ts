const padNumber = (num: number): string => {
    return num.toString().padStart(6, '0')
  }
  
  const sixDigitCounter = (): void => {
    for (let i = 0; i <= 999999; i++) {
      console.log(padNumber(i))
    }
  }
  
  // Run the counter
  sixDigitCounter()

//   if (i % 100 === 0) {
//     console.log(padNumber(i))
//   }