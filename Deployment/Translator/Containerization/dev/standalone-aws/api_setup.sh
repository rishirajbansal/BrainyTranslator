#!/bin/sh

set -x #echo on

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres server..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL Server started"
fi

# echo $WORK_DIR
cd $WORK_DIR/backend/Translator
pip3 install -r ../requirements.txt

#Removes all data from the database and re-executes any post-synchronization handlers.
#python manage.py flush --no-input


python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --no-input

#python manage.py runserver $HOST:$PORT --noreload

exec "$@"