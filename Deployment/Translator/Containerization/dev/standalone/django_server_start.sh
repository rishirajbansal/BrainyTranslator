#!/bin/sh

set -x #echo on

cd $WORK_DIR/backend/Translator
python manage.py runserver $HOST:$PORT --noreload

#exec "$@"