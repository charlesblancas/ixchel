# ixchel
Ixchel (pronounced ee-shl) is an indentation-based markup language that is transpiled to HTML.

## Why Ixchel?
I wrote [my resume](https://github.com/Charles-Spencer-Blancas/html-resume) in HTML so I can make it look exactly how I want it to with CSS. However, after a few rewrites, I found modifying the content cumbersome since there was a lot of nesting, so I decided to create Ixchel, a markup language that gets converted to HTML, that uses indentation for nesting since my autoformatter indents HTML anyway. Other than removing closing tags, I also added some shortcuts similar to [Emmet](https://code.visualstudio.com/docs/editor/emmet) for classes and IDs since that is how I write HTML anyway.

## Sample
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
            h2.item-title >{Bachelor of Engineering - Software Engineering Co-op}
            h2.item-date >{Aug 2021 - May 2025}
        h2.item-subtitle >{McGill University}
    ul.item-body
        li.item-point >{Cumulative GPA: 3.86/4.00}
        li.item-point >{2021 - 2022: Dean's Honor List, Brodeur-Drummond and Professor Martin Levine Scholarships}
```

## Usage
1. `npm install --global ixchel-lang` to install the [npm package](https://www.npmjs.com/package/ixchel-lang)
2. (Optional) Install the [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=ixchel-lang.ixchel) to get syntax highlighting
3. Write your Ixchel file (with the file extension `.ixh` if you want VSCode syntax highlighting)
4. Do `ixchel [file.ixh] [new_file.html]` to convert your Ixchel file to HTML

## Why *the Name* Ixchel?
I thought of words that could include "indented" "X-compiled (transcompiled)" and "HTML" and stumbled upon the Mayan goddess Ixchel and used that as a backronym that means "Indented, X-Compiled HTML-Ending Language." Just call it Ixchel.
