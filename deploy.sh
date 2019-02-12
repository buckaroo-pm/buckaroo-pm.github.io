#/bin/bash

ORIGIN=`git remote get-url origin`
MESSAGE=`git --no-pager log --format="%h: %s" -n1`
cd dist
git init
git add .
git commit -m "$MESSAGE"
git stash
git push -f $ORIGIN develop:master
