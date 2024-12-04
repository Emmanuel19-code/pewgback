CREATE TABLE IF NOT EXISTS users3 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(50),
            name VARCHAR(255) NOT NULL,
            firstname VARCHAR(255),
            lastname VARCHAR(255),
            othername VARCHAR(255),
            gender VARCHAR(50),
            mobilephonenumber VARCHAR(15),
            password VARCHAR(255),
            email VARCHAR(255) NOT NULL UNIQUE,
            verifiedcode VARCHAR(50),
            userlog TEXT,
            validatecode VARCHAR(50),
            last_login DATETIME,
            failedAttempts INT DEFAULT 0,
            lastFailedAttempt DATETIME,
            login_failed_attempts INT DEFAULT 0,
            lockedaccount BOOLEAN DEFAULT FALSE,
            secret VARCHAR(255),
            reg_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
            isVerified BOOLEAN DEFAULT FALSE,
            verificationToken VARCHAR(255),
            status VARCHAR(50),
            business_name VARCHAR(255),
            business_shortname VARCHAR(100),
            country VARCHAR(100),
            address TEXT,
            business_profile TEXT,
            business_location VARCHAR(255),
            uchangepwd BOOLEAN DEFAULT FALSE
          )

CREATE TABLE IF NOT EXISTS user_records1 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userid varchar(50),
            memberstatus VARCHAR(255),
            email VARCHAR(255),
            image VARCHAR(255),
            secret VARCHAR(255),
            status VARCHAR(50),
            studentschool VARCHAR(255),
            studentcourse VARCHAR(255),
            studentlevel VARCHAR(50),
            pensa varchar(50),
            profession VARCHAR(255)
          )

CREATE TABLE IF NOT EXISTS churcharea1 (
            churchArea varchar(50),
            district varchar(50),
            local varchar(50),
            course varchar(50),
            imageUrl varchar(255),
            guild varchar(50),
            userid varchar(50),
            memberstatus varchar(50)         
          )