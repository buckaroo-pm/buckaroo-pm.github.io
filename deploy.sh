#/bin/bash

ORIGIN=`git remote get-url origin`
MESSAGE=`git --no-pager log --format="%h: %s" -n1`
mkdir -p dist
cp -r img ./dist
cd dist
git init
git remote add origin $ORIGIN
git add .
git commit -m "$MESSAGE"
git stash
git push -f $ORIGIN develop:master
