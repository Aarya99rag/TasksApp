export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
    // The test() method checks if the given email matches the pattern (regex). If it matches, it returns true, otherwise false.
};

// ^ : This asserts the start of the string. It ensures that the match happens from the beginning of the email.

// [^\s@]+ : This matches one or more characters that are not spaces (\s) or the @ symbol. [^\s@] is a character class that matches any character except a space or @. + means one or more of these characters.

// @ : This matches the literal @ symbol in the email.

// [^\s@]+ : This part ensures the domain name (like example in example.com) contains one or more characters that are not spaces or @.

// \. : This matches a literal period (.). The backslash (\) escapes the period because in regular expressions, a period is a special character that means "any character". So, \. ensures it's just a period.

// [^\s@]+ : This part matches the top-level domain (like .com, .org) which consists of one or more characters that are not spaces or @.

// $ : This asserts the end of the string. It ensures that the match happens until the end of the string (no extra characters after the domain).

export const getInitials = (name) =>{
    if(!name) return "";

    const words = name.split(" "); 
    // ["katsuki", "Bakugo"]
    let initials = "";

    for(let i = 0; i < Math.min(words.length, 2); i++){
        // min(words.length=2,2) = 2, loop runs from 0-1
        initials += words[i][0];
        // words[i=0] = katsuki
        // words[0][0] = k
    }

    return initials.toUpperCase();
}