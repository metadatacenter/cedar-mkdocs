# Fix Homebrew

Before you move forward, you should really make sure that your `brew` is in good shape.
 
You can prevent issues with `brew install` later by making everything right at this moment.

With an incorrect setup you could also run into a situation, when an installation goes fine, 
but executing a command will fail for some obscure reason (i.e. an incorrect symlink).

???+ warning "Important"

    Please take your time, and try to fix every warning that `brew doctor` mentions.
    
    Although these are just warnings, we found that they can cause issues later.
    
## Brew doctor, cleanup

Use these commands to see what is not correct with brew. You might need to fix these "by hand"
```sh
brew doctor
```

You can also let `brew` to try to fix things:
```sh
brew cleanup
```

## Common warnings

This is a non-exhaustive set of warnings from `brew doctor` output that you should fix before moving on: 

```
Warning: Unbrewed dylibs were found in /usr/local/lib.

Warning: Unbrewed static libraries were found in /usr/local/lib.

Warning: Unbrewed .pc files were found in /usr/local/lib/pkgconfig.

Warning: You have unlinked kegs in your Cellar.

Warning: Unbrewed header files were found in /usr/local/include.
```

## Common solutions

These are some commands that you can use to fix these issues. Here `cedar-dev` is your current username:

```sh
sudo chown -R cedar-dev /usr/local/Homebrew/

sudo chown -R cedar-dev /usr/local/Cellar/

sudo chown -R cedar-dev /usr/local/share

sudo chown -R cedar-dev /usr/local/lib

sudo chown -R cedar-dev /usr/local/Frameworks/Python.framework

brew link --overwrite python@3.8
```

