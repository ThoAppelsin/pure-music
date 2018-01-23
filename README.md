This is a project I have developed as a favor for a friend.
He was excited to see what he might be able to produce with the rational multiples of a set base frequency.
He was referring the idea as *pure music*, and so I have chosen the name of the project.

## How to Use

The main application is under the [**WebPage**](https://github.com/ThoAppelsin/pure-music/tree/master/WebPage)
directory. There you can open up the [**main.html**](https://github.com/ThoAppelsin/pure-music/blob/master/WebPage/main.html)
on your browser, and it should then be evident how to use it.
[**combined.html**](https://github.com/ThoAppelsin/pure-music/blob/master/WebPage/combined.html)
is provided as a one-file alternative, whereas the **main.\*** files belong together and need each other.

You may play the notes with your keyboard, with respect to the letters and signs the boxes are annotated.
Alternatively, you can also click them with a mouse. A short explanation for the 3 parameters would be:

| Parameter | Explanation |
| ---- | ---- |
| Base Frequency | The frequency at which the 1/1 key plays. |
| Least Common Multiple Limit | The limit to the fractional details, as in a key with the factor A/B appears on the screen if and only if the multiplication of A and B is less than or equal to this limit. |
| Octave Limit | The limit to how far the octaves can extend, as in a key with 1/A or A/1 may only appear if A is less than or equal to this limit. |

## The Idea

This is me reciting the ideas he has conveyed to me:
The sounds we refer to as *music* is a set of notes that resonate well together.

As I personally also am aware of from my physics education,
a vibration is accompanied by its harmonics, i.e. vibrations that have the frequencies at
integer multiples of the original vibration's frequency.
While a vibration resonates exactly well with a vibration of the exact same frequency,
two vibrations that are related to each other with a rational factor would also more or less
resonate well together.

At this point, he was giving me some examplar musical keys like C and E# (I am making them up)
that are known to be in musical accord (aka. chord), which we would then test to see if they
were related with each other by a rational factor. They always were really close to being so,
but not exactly. The theory was that their accordance would be even better, if they were
exactly so.

## The Application

It seemed to me that he was on a right track. I helped, or at least tried to, develop his
ideas a little further and also engineer them to the constraints we had.
There would be limited amount of rational factors that we could utilize,
yet there actually are infinitely many of them even from 1/1 to 2/1, or to 1/2.

Since we were basing the idea off to the harmonic accordances, I then suggested
to have our fractional factors limited with a least common multiple (LCM) measure.
Another, but more obvious, limit we had was the octave limit, which would limit us
on how many octaves we would be able to span our frequencies.

### More on the LCM limit

What I mean by the LCM limit may not be immediately evident to the reader.
For a note that has the frequency A/B times of the base note, the LCM value is
A times B, assuming A/B is the fraction reduced to its lowest terms.

With a LCM limit value of 32, a note with the frequency 2/3 times the base frequency
would fall within the limits, while a note with the frequency 3/11 would fall outside.
