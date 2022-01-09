    CREATE OR ALTER PROCEDURE WriteSP.CreateNewUser
    (
        @FullName NVARCHAR(100),
        @UserName NVARCHAR(100),
        @Password BINARY(64)
    )
    AS
    BEGIN
        BEGIN TRY
            BEGIN TRANSACTION
                INSERT INTO [User]
                (
                    Guid,
                    FullName,
                    UserName,
                    Password,
                    CreatedOn,
                    ModifiedOn,
                    IsDeleted
                )
                VALUES
                (
                    NEWID(),
                    @FullName,
                    @UserName,
                    @Password,
                    GETUTCDATE(),
                    GETUTCDATE(),
                    0
                );
            COMMIT TRANSACTION;
        END TRY
        BEGIN CATCH
            IF @@TRANCOUNT > 0 
                ROLLBACK TRANSACTION;
        END CATCH
    END