## Install `ruby`
http://stackoverflow.com/questions/18908708/installing-ruby-gem-in-windows/22151329#22151329

1. Install Ruby via RubyInstaller: http://rubyinstaller.org/downloads/
2. Check your ruby version: Start - Run - type in cmd to open a windows console
3. Type in ruby -v
4. You will get something like that: ruby 2.0.0p353 (2013-11-22) [i386-mingw32]
5. Download and install DevelopmentKit from the same download page as Ruby Installer. Choose an ?exe file orresponding to your environment (32 bits or 64 bits, take the latest Ruby version implementation; smth like DevKit-mingw64-32-4.7.2-20130224-1151-sfx.exe (32 bits example).
6. Follow the installation instructions for DevelopmentKit described at: https://github.com/oneclick/rubyinstaller/wiki/Development-Kit. Adapt it for Windows.


## Install `node.js`
http://nodejs.org/download/

## Add follow paths to your environment variables list:
```C:\Program Files\Ruby21\bin;C:\Program Files\nodejs\;```

where `C:\Program Files\Ruby21` and `C:\Program Files\nodejs` is your installation's paths of `ruby` and `nodejs` respectively

## Setup project

Run `cmd.exe`

Go to the folder of your project like this: `cd <project path>`

Then run:

```npm install```

```gem install bundler```

(If in this step you get certificate error then follow instruction: https://gist.github.com/luislavena/f064211759ee0f806c88)

```bundle install```

```cd node_modules/.bin```


## Done!

For run local server and watch for changes run this simple command:

`gulp`

For build project for production run this:

`gulp dist`

This command minify your css, js and images files and also inject critical css to all html files.
Minified js and css files will available with `.min` suffix. But all original images files will be *replaced* with their minified version.
