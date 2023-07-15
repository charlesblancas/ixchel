# Ixchel
Ixchel (pronounced ee-shl) is an indentation-based markup language that is transpiled to HTML.

## Why Ixchel?
I wrote [my resume](https://github.com/Charles-Spencer-Blancas/html-resume) in HTML so I can make it look exactly how I want it to with CSS. However, after a few rewrites, I found modifying the content cumbersome since there was a lot of nesting. I decided to create Ixchel, a markup language that gets converted to HTML, that uses indentation for nesting since my autoformatter indents HTML anyway. Other than removing closing tags, I also added some shortcuts similar to [Emmet](https://code.visualstudio.com/docs/editor/emmet) for classes and IDs since that is how I write HTML anyway.

## Syntax
- The first string of characters is the name of the element. It cannot contain the characters `%.#>{}` or whitespace
- To nest an element inside another, indent it.
```
div
    div
    div
div
    div
        div
```
is equivalent to
```html
<div>
    <div></div>
    <div></div>
</div>
<div>
    <div>
        <div></div>
    </div>
</div>
```
- To add a class, do `.name-of-class`
```
div.container
    div.class
    div.you.can.chain.them.together
    div .you .can .put .spaces .between .them
    div .or.you .can .mix.it .up .if .you.want
```
is equivalent to
```html
<div class="container">
    <div class="class"></div>
    <div class="you can chain them together"></div>
    <div class="you can put spaces between them"></div>
    <div class="or you can mix it up if you want"></div>
</div>
```
- To add an id, do `#name-of-id`
```
div.container
    div#id
    div#ids.and.classes.can.mix
    div.you.can.place.it.at.the#end
    div .spaces #are.also.ignored .here
    div.ids.can.be#surrounded.if.you.want
```
is equivalent to
```
<div class="container">
    <div id="id"></div>
    <div class="and classes can mix" id="ids"></div>
    <div class="you can place it at the" id="end"></div>
    <div class="spaces also ignored here" id="are"></div>
    <div class="ids can be if you want" id="surrounded"></div>
</div>
```
- To add an attribute, do `%name-of-attribute{optional-content}`
```
!DOCTYPE %html

html %lang{en}
    head
        meta %charset{UTF-8}
        meta %http-equiv{X-UA-Compatible} %content{IE=edge}
        link %rel{stylesheet} %href{normalize.css}
        link %rel{stylesheet} %href{main.css}
        script %src{index.js}

body
    button#increment %onclick{increment()}
    button#do-nothing %disabled
```
is equivalent to
```HTML
<!DOCTYPE html />
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http="X-UA-Compatible" content="IE=edge" />
        <link rel="stylesheet" href="normalize.css" />
        <link rel="stylesheet" href="main.css" />
        <script src="index.js"></script>
    </head>
</html>
<body>
    <button id="increment" onclick="increment()"></button>
    <button id="do-nothing" disabled></button>
</body>
```
**BUG: The self-closing / in the !DOCTYPE declaration should not be there**
- To write content inside an element, surround it with `>{}`
```
body
    div >{This is content inside a div}
    div
        >{This is a
        multiline piece of content.
        There are still some bugs that need
        to be ironed out regarding this, though}
```
is equivalent to
```html
<body>
    <div>This is content inside a div</div>
    <div>
        This is a multiline piece of content. There are still some bugs that
        need to be ironed out regarding this, though
    </div>
</body>
```

## Usage
1. `npm install --global ixchel-lang` to install the [npm package](https://www.npmjs.com/package/ixchel-lang)
2. (Optional) Install the [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=ixchel-lang.ixchel) to get syntax highlighting
3. Write your Ixchel file (with the file extension `.ixh` if you want VSCode syntax highlighting)
4. Do `ixchel [file.ixh] [new_file.html]` to convert your Ixchel file to HTML

## Why *the Name* Ixchel?
I thought of words that could include "indented" "X-compiled (transcompiled)" and "HTML" and stumbled upon the Mayan goddess Ixchel and used that as a jokey backronym that means "Indented, X-Compiled HTML-Ending Language." Just call it Ixchel.
