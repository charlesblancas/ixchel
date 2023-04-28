# ixchel
## 🚧🚧 Project and README Still Under Construction 🚧🚧

Ixchel (pronounced ee-shl) is an indentation based markup language that is transcompiled to HTML.

## Why Ixchel?
For smaller projects that use vanilla HTML and CSS, Ixchel provides a less cumbersome syntax for HTML. Once you 
start nesting components three or four levels (which may be needed for Flexbox, for example), the structure of the document becomes less evident because closing tags create clutter. With Ixchel, you write the same amount of HTML, and no more. It lets developers focus more on the content of the document rather than the syntax.

## Sample
**TODO** since not all HTML features are possible yet and syntax is not final, but so far this sample section from my HTML resume:
```html
<div class="item">
    <div class="item-header">
        <div class="item-title-container">
            <h2 class="item-title">
                Bachelor of Engineering - Software Engineering Co-op
            </h2>
            <h2 class="item-date">Aug 2021 - May 2025</h2>
        </div>
        <h2 class="item-subtitle">McGill University</h2>
        <ul class="item-body">
            <li class="item-point">Cumulative GPA: 3.90/4.0</li>
            <li class="item-point">
                2021 - 2022: Dean's Honor List, Brodeur-Drummond and Professor
                Martin Levine Scholarships
            </li>
        </ul>
    </div>
</div>
```
is written as such in Ixchel:
```
div.item
    div.item-header
        div.item-title-container
            h2.item-title
                "Bachelor of Engineering - Software Engineering Co-op"
            h2.item-date
                "Aug 2021 - May 2025"
        h2.item-subtitle
            "McGill University"
        ul.item-body
            li.item-point
                "Cumulative GPA: 3.90/4.0"
            li.item-point
                "2021 - 2022: Dean's Honor List, Brodeur-Drummond and Professor Martin Levine Scholarships"
```

## How To Use
**TODO**

## Why *the Name* Ixchel?
I wanted the name to be a backronym that could include the terms "indented" "X-compiled (transcompiled)" and "HTML" and I stumbled upon the Mayan Goddess Ixchel, and I decided to name it after that. The final backronym is "Indented, X-Compiled HTML-Ending Language." The "E" might become "Extended" if features that are not native to HTML are added, but that point has not yet been reached.